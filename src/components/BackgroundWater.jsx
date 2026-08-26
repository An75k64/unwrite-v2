"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Fog } from "@react-three/drei";
import * as THREE from "three";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
  }, []);
  return mobile;
}

function InteractiveWater({ isMobile }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: 0 },
      // Colors for the water gradient based on height
      uColorDeep: { value: new THREE.Color("#001a33") },
      uColorShallow: { value: new THREE.Color("#00b7ff") },
    }),
    []
  );

  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current.set(x * (viewport.width / 2), y * (viewport.height / 2));
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [viewport]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const prevMouse = mouse.current.clone();
    mouse.current.lerp(targetMouse.current, 0.05);
    
    const velocity = mouse.current.distanceTo(prevMouse);
    mouseVelocity.current.lerp(new THREE.Vector2(velocity, velocity), 0.1);
    
    if (materialRef.current && materialRef.current.userData.shader) {
      materialRef.current.userData.shader.uniforms.uTime.value = time * 0.5;
      materialRef.current.userData.shader.uniforms.uMouse.value.copy(mouse.current);
      materialRef.current.userData.shader.uniforms.uVelocity.value = mouseVelocity.current.x * 100;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.01; // slower rotation
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uMouse = uniforms.uMouse;
    shader.uniforms.uVelocity = uniforms.uVelocity;
    shader.uniforms.uColorDeep = uniforms.uColorDeep;
    shader.uniforms.uColorShallow = uniforms.uColorShallow;

    // Inject varying for height to color the water in fragment shader
    shader.vertexShader = `
      varying float vHeight;
      ${shader.vertexShader}
    `;

    shader.vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uVelocity;
      
      // Simplex 3D Noise 
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      
      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                 
        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      
      float noiseFreq = 0.3;
      float noiseAmp = 0.9; // Increased for more dramatic water peaks
      vec3 noisePos = vec3(position.x * noiseFreq + uTime, position.y * noiseFreq - uTime, uTime * 0.5);
      float noise = snoise(noisePos) * noiseAmp;
      
      float noise2 = snoise(noisePos * 2.0 - uTime) * (noiseAmp * 0.4);
      
      vec4 worldPositionCoords = modelMatrix * vec4(position, 1.0);
      float dist = distance(worldPositionCoords.xy, uMouse);
      
      float rippleArea = 4.5;
      float ripple = smoothstep(rippleArea, 0.0, dist);
      
      float wave = sin(dist * 3.5 - uTime * 6.0) * ripple * (0.4 + uVelocity * 0.6);
      
      float totalDisplacement = noise + noise2 + wave + (ripple * 0.6);
      transformed.z += totalDisplacement;
      
      // Pass the height to fragment shader for coloring
      vHeight = totalDisplacement;
      `
    );

    // Fragment shader coloring based on height
    shader.fragmentShader = `
      varying float vHeight;
      uniform vec3 uColorDeep;
      uniform vec3 uColorShallow;
      ${shader.fragmentShader}
    `.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      // Mix between deep ocean blue and bright cyan crests based on vertex height
      float heightMix = smoothstep(-0.8, 1.2, vHeight);
      vec3 waterColor = mix(uColorDeep, uColorShallow, heightMix);
      vec4 diffuseColor = vec4( waterColor, opacity );
      `
    );

    materialRef.current.userData.shader = shader;
  };

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -4]}>
      <planeGeometry args={[40, 40, isMobile ? 64 : 128, isMobile ? 64 : 128]} />
      {/* Glossy liquid material */}
      <meshStandardMaterial
        ref={materialRef}
        roughness={0.05} // ultra glossy
        metalness={0.9}  // high reflectivity for water
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}

function Scene({ isMobile }) {
  return (
    <>
      <ambientLight intensity={1.2} color="#44aaff" />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#00e5ff" />
      <directionalLight position={[-10, 10, -5]} intensity={1.5} color="#0055ff" />
      <pointLight position={[0, 3, 2]} intensity={2.0} color="#88ddff" distance={15} />

      <Environment preset="city" />

      <fog attach="fog" color="#000205" near={4} far={20} />

      <InteractiveWater isMobile={isMobile} />
    </>
  );
}

export default function BackgroundWater() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
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
        camera={{ position: [0, 1, 6], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        style={{ background: "#000205" }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
