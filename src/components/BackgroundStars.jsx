"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
  }, []);
  return mobile;
}

function InteractiveStars({ isMobile }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  
  const count = isMobile ? 3000 : 8000;
  
  const mouse = useRef(new THREE.Vector2(-999, -999));
  const targetMouse = useRef(new THREE.Vector2(-999, -999));
  
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e) => {
      // NDC
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // Approximate mapping to world space
      targetMouse.current.set(x * (viewport.width / 2) * 1.5, y * (viewport.height / 2) * 1.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [viewport]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-999, -999) },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mouse.current.lerp(targetMouse.current, 0.1);
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.03;
      pointsRef.current.rotation.z = time * 0.01;
    }
  });

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Create a large spherical field
      const r = 3 + Math.random() * 15;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      randoms[i] = Math.random();
    }
    
    return { positions, randoms };
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          attribute float aRandom;
          varying float vAlpha;
          
          void main() {
            vec3 pos = position;
            
            // Subtle twinkle
            vAlpha = 0.3 + 0.7 * sin(uTime * (aRandom * 5.0) + aRandom * 100.0);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Mouse scattering logic
            // We approximate world coords ignoring rotation for mouse interaction speed
            vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
            float dist = distance(worldPos.xy, uMouse);
            
            float scatterRadius = 3.0;
            if (dist < scatterRadius) {
              float force = (scatterRadius - dist) / scatterRadius;
              // Push particles away from mouse
              vec2 dir = normalize(worldPos.xy - uMouse);
              worldPos.xy += dir * force * 2.5 * aRandom;
              // Push them back in Z too
              worldPos.z -= force * 1.5;
              
              // Boost brightness when scattered
              vAlpha += force * 1.5;
              
              mvPosition = viewMatrix * vec4(worldPos, 1.0);
            }
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (15.0 * aRandom) / -mvPosition.z;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          
          void main() {
            // Make them soft circles instead of squares
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
          }
        `}
      />
    </points>
  );
}

function Scene({ isMobile }) {
  return (
    <>
      <InteractiveStars isMobile={isMobile} />
    </>
  );
}

export default function BackgroundStars() {
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
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        style={{ background: "#000000" }} // Deep space black
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
