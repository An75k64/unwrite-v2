"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── Simplex Noise for smooth fluid motion ─── */
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.7928429 - 0.8537347 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/* ─────────────────────────────────────────────────────────
   Photorealistic Flowing Water Surface & Crown
───────────────────────────────────────────────────────── */
function FlowingSplash() {
  const meshRef = useRef();
  
  // Custom Vertex Shader to animate the geometry into a flowing crown
  const materialProps = {
    transmissionSampler: false,
    backside: true,
    samples: 4,
    resolution: 1024,
    transmission: 1.0,
    roughness: 0.05,
    thickness: 1.5,
    ior: 1.33,
    chromaticAberration: 0.04,
    anisotropy: 0.5,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    color: "#e6f2ff",
    attenuationColor: "#a3c8ff",
    attenuationDistance: 2.0,
  };

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime() * 0.4;
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    
    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      ${NOISE_GLSL}
      
      void main() {
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      
      // Calculate distance from center for crown shape
      float dist = length(position.xy); // geometry is plane, so x and y
      
      // Flowing noise
      float n = snoise(vec3(position.x * 0.3, position.y * 0.3, uTime)) * 0.5;
      float n2 = snoise(vec3(position.x * 1.2, position.y * 1.2, uTime * 1.5)) * 0.15;
      
      // Crown shape - lifts up in a ring
      float crownRadius = 3.5;
      float crownWidth = 1.2;
      float ring = exp(-pow((dist - crownRadius) / crownWidth, 2.0));
      
      // Spikes/fingers around the ring
      float angle = atan(position.y, position.x);
      float spikes = sin(angle * 14.0 + uTime * 2.0) * 0.5 + 0.5;
      spikes = pow(spikes, 3.0); // Sharpen spikes
      
      // Base ripple
      float ripple = sin(dist * 3.0 - uTime * 4.0) * exp(-dist * 0.2) * 0.3;
      
      // Combine for final height (Z axis on plane)
      float lift = (ring * 4.0 * (0.4 + spikes * 0.6)) + (n + n2) * (1.0 + ring * 2.0) + ripple;
      
      transformed.z += lift;
      
      // Flare out the crown
      transformed.xy *= (1.0 + ring * 0.15);
      `
    );
  };

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[30, 30, 256, 256]} />
        {/* We use standard MeshPhysicalMaterial with transmission for pure photorealism */}
        <meshPhysicalMaterial
          {...materialProps}
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   Floating Droplets (using the same refractive material)
───────────────────────────────────────────────────────── */
function Droplets() {
  const groupRef = useRef();
  
  const droplets = useMemo(() => {
    const drops = [];
    for (let i = 0; i < 40; i++) {
      drops.push({
        position: [
          (Math.random() - 0.5) * 8,
          Math.random() * 6,
          (Math.random() - 0.5) * 8
        ],
        scale: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.5 + 0.2,
        offset: Math.random() * Math.PI * 2
      });
    }
    return drops;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, i) => {
        const drop = droplets[i];
        // Slow smooth floating motion
        mesh.position.y = drop.position[1] + Math.sin(t * drop.speed + drop.offset) * 1.5;
        mesh.position.x = drop.position[0] + Math.cos(t * drop.speed * 0.5 + drop.offset) * 0.5;
        mesh.position.z = drop.position[2] + Math.sin(t * drop.speed * 0.8 + drop.offset) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {droplets.map((drop, i) => (
        <mesh key={i} scale={drop.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={drop.scale * 2}
            roughness={0.01}
            ior={1.33}
            clearcoat={1}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   Studio Lighting Environment for Reflections
───────────────────────────────────────────────────────── */
function StudioLighting() {
  return (
    <>
      {/* Background color of the environment */}
      <color attach="background" args={["#030508"]} />
      
      {/* 
        Lightformers create physical glowing shapes in the environment map 
        that will perfectly reflect off our refractive water material,
        giving those sharp white specular highlights.
      */}
      <Environment resolution={512}>
        {/* Overhead softbox */}
        <Lightformer form="rect" intensity={4} position={[0, 10, 0]} scale={[10, 10, 1]} target={[0, 0, 0]} />
        
        {/* Side rim lights */}
        <Lightformer form="rect" intensity={3} position={[-10, 2, -5]} scale={[5, 10, 1]} target={[0, 0, 0]} color="#baddff" />
        <Lightformer form="rect" intensity={3} position={[10, 2, 5]} scale={[5, 10, 1]} target={[0, 0, 0]} />
        
        {/* Deep blue fill */}
        <Lightformer form="circle" intensity={1} position={[0, -5, -10]} scale={[20, 20, 1]} target={[0, 0, 0]} color="#003366" />
      </Environment>

      {/* Actual scene lights to illuminate any non-refractive elements if added */}
      <ambientLight intensity={0.2} color="#0a1526" />
      <directionalLight position={[5, 8, 3]} intensity={2.0} color="#e6f2ff" />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export default function BackgroundCinematicFluid() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 4, 12], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <FlowingSplash />
          <Droplets />
        </Suspense>
      </Canvas>
    </div>
  );
}
