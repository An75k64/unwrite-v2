"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────
   Frozen Water Crown Mesh
─────────────────────────────────────────────────────── */
function FrozenCrown({ scrollY }) {
  const groupRef = useRef();
  const matRef = useRef();

  // Create the crown geometry
  const { geometry } = useMemo(() => {
    const RADIAL = 256;
    const TUBE = 64;
    const R = 2.5;
    const geo = new THREE.TorusGeometry(R, 0.15, TUBE, RADIAL);
    return { geometry: geo };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current?.userData?.shader) {
      matRef.current.userData.shader.uniforms.uTime.value = t;
    }
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = t * 0.1;
      // Smooth parallax scrolling based on page scroll (passed via prop or calculated)
      // We'll use a simple floating animation plus the rotation
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2 - 0.5;
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      varying vec3 vNormalWorld;
      varying vec3 vViewDir;
      varying float vHeight;
      
      // Simplex noise function
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

      void main() {
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      
      float angle = atan(position.z, position.x);
      
      // Fixed fingers to simulate frozen splash
      float fingers = 16.0;
      float fingerH = (sin(angle * fingers) * 0.5 + 0.5);
      fingerH = pow(fingerH, 3.0); // Make them sharper
      
      // Noise to make it organic and chaotic
      float n = snoise(vec3(position.x * 1.5, position.y * 1.5, position.z * 1.5)) * 0.3;
      
      float liftAmount = 5.0 * (fingerH + n * 0.5);
      
      float crossSection = (normal.y * 0.5 + 0.5);
      
      transformed.y += liftAmount * crossSection;
      
      // Flare out
      transformed.xz *= (1.0 + crossSection * 0.2);
      
      vHeight = transformed.y;
      `
    ).replace(
      `#include <worldpos_vertex>`,
      `
      #include <worldpos_vertex>
      vNormalWorld = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vViewDir = normalize(cameraPosition - worldPosition.xyz);
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
      varying vec3 vNormalWorld;
      varying vec3 vViewDir;
      varying float vHeight;
      void main() {
      `
    ).replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      // Base dark glass color
      vec3 baseCol = vec3(0.01, 0.02, 0.03);
      
      // Calculate fresnel for neon edges
      float fresnel = dot(vViewDir, vNormalWorld);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 3.0);
      
      // Neon colors
      vec3 cyan = vec3(0.0, 1.0, 1.0);
      vec3 orange = vec3(1.0, 0.34, 0.2);
      
      // Mix neon based on height and position to create a gradient effect
      vec3 neonCol = mix(orange, cyan, smoothstep(0.0, 3.0, vHeight));
      
      vec3 col = baseCol + neonCol * fresnel * 2.5;
      
      vec4 diffuseColor = vec4(col, opacity);
      `
    );
    matRef.current.userData.shader = shader;
  };

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={matRef}
          roughness={0.1}
          metalness={0.9}
          color="#111"
          transparent
          opacity={0.8}
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
      {/* Inner fill sheet to make it look like a solid splash base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[2.45, 64]} />
        <meshStandardMaterial
          roughness={0.1}
          metalness={0.9}
          color="#050505"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────
   Floating Particle Sparks
─────────────────────────────────────────────────────── */
function Sparks() {
  const COUNT = 150;
  const ref = useRef();
  
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const ph = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      size[i] = Math.random() * 4 + 1;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: size, phases: ph };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.05;
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        // Subtle drift upward
        positions[i * 3 + 1] += Math.sin(t + phases[i]) * 0.01 + 0.01;
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = -5; // Reset to bottom
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float size;
          varying vec3 vPos;
          void main() {
            vPos = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (200.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vPos;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);
            // Mix cyan and orange based on y position
            vec3 cyan = vec3(0.0, 1.0, 1.0);
            vec3 orange = vec3(1.0, 0.34, 0.2);
            vec3 col = mix(orange, cyan, smoothstep(-5.0, 5.0, vPos.y));
            gl_FragColor = vec4(col, alpha * 0.6);
          }
        `}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────
   Floor Ripples
─────────────────────────────────────────────────────── */
function RippleFloor() {
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (matRef.current?.userData?.shader) {
      matRef.current.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    
    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      varying vec2 vUv2;
      void main() {
        vUv2 = uv;
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      float dist = length(position.xz);
      float ripple = sin(dist * 2.0 - uTime * 2.0) * exp(-dist * 0.1) * 0.2;
      transformed.y += ripple;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      varying vec2 vUv2;
      void main() {
      `
    ).replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      float dist = length(vUv2 - 0.5) * 2.0;
      float alpha = smoothstep(1.0, 0.0, dist); // Fade out at edges
      
      vec4 diffuseColor = vec4(diffuse, opacity * alpha);
      `
    );
    matRef.current.userData.shader = shader;
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[50, 50, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#0d0d0d"
        roughness={0.2}
        metalness={0.8}
        transparent
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────
   Scene
─────────────────────────────────────────────────────── */
function Scene() {
  const { camera } = useThree();
  
  // Subtle camera parallax based on scroll or mouse could be added here
  useFrame((state) => {
    // We can add subtle camera drift
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#0d0d0d" />
      
      {/* Neon directional lights */}
      <directionalLight position={[5, 5, 2]} intensity={3.5} color="#00ffff" />
      <directionalLight position={[-5, -2, -5]} intensity={4.5} color="#ff5733" />
      
      <pointLight position={[0, 4, 0]} intensity={2} color="#00ffff" distance={15} />
      <pointLight position={[0, -3, 0]} intensity={3} color="#ff5733" distance={15} />

      <Environment preset="night" />
      <fog attach="fog" color="#0d0d0d" near={5} far={30} />

      <FrozenCrown />
      <Sparks />
      <RippleFloor />
    </>
  );
}

/* ──────────────────────────────────────────────────────
   Export
─────────────────────────────────────────────────────── */
export default function BackgroundCyberSplash() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 150);
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
        camera={{ position: [0, 1.5, 9], fov: 45, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        style={{ background: "#0d0d0d" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
