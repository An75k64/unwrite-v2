"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────
   Water Surface (reflective dark plane beneath crown)
─────────────────────────────────────────────────────── */
function WaterSurface() {
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCrownX: { value: 1.8 },
    uCrownZ: { value: 0.0 },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current?.userData?.shader) {
      matRef.current.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime   = uniforms.uTime;
    shader.uniforms.uCrownX = uniforms.uCrownX;
    shader.uniforms.uCrownZ = uniforms.uCrownZ;

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      uniform float uCrownX;
      uniform float uCrownZ;
      varying vec2 vUv2;
      void main() {
        vUv2 = uv;
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      // Subtle gentle ripples on the resting surface
      float r = distance(position.xz, vec2(uCrownX, uCrownZ));
      float ripple = sin(r * 3.0 - uTime * 2.5) * exp(-r * 0.35) * 0.04;
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
      // Very dark navy water surface
      vec3 col = mix(vec3(0.005, 0.01, 0.018), vec3(0.04, 0.07, 0.12), vUv2.y);
      vec4 diffuseColor = vec4(col, opacity);
      `
    );

    matRef.current.userData.shader = shader;
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
      <planeGeometry args={[40, 40, 64, 64]} />
      <meshStandardMaterial
        ref={matRef}
        roughness={0.02}
        metalness={0.95}
        color="#020610"
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────
   Water Crown — the main centrepiece splash
─────────────────────────────────────────────────────── */
function WaterCrown({ mouse }) {
  const groupRef   = useRef();
  const meshRef    = useRef();
  const matRef     = useRef();

  /* Crown geometry: a tube ring that is vertex-displaced into a crown */
  const { geometry } = useMemo(() => {
    const RADIAL = 128;   // segments around ring
    const TUBE   = 32;    // segments along tube thickness
    const R      = 1.5;   // crown radius
    const geo    = new THREE.TorusGeometry(R, 0.06, TUBE, RADIAL);
    return { geometry: geo };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uPhase:       { value: 0 },  // 0→1 crown rise/fall cycle
    uFingers:     { value: 12 }, // number of crown spires
    uCrownHeight: { value: 0 },  // animated height
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Loop: 0-2s rise, 2-3s hold, 3-5s fall, 5-6s pause → repeat every 7s
    const period = 7.0;
    const local  = (t % period);
    let phase    = 0;
    if (local < 2.0)       phase = local / 2.0;              // rise
    else if (local < 3.0)  phase = 1.0;                      // hold
    else if (local < 5.5)  phase = 1.0 - (local - 3.0) / 2.5; // fall
    else                   phase = 0;

    // Eased height
    const h = Math.pow(phase, 0.5) * 2.8;

    if (matRef.current?.userData?.shader) {
      const sh = matRef.current.userData.shader;
      sh.uniforms.uTime.value        = t;
      sh.uniforms.uPhase.value       = phase;
      sh.uniforms.uCrownHeight.value = h;
    }

    if (groupRef.current && mouse?.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.current.x * 0.3, 0.04);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, mouse.current.y * 0.2, 0.04);
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime        = uniforms.uTime;
    shader.uniforms.uPhase       = uniforms.uPhase;
    shader.uniforms.uFingers     = uniforms.uFingers;
    shader.uniforms.uCrownHeight = uniforms.uCrownHeight;

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      uniform float uPhase;
      uniform float uFingers;
      uniform float uCrownHeight;
      varying float vHeightFactor;
      void main() {
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>

      // Angle around the torus ring
      float angle = atan(position.z, position.x);

      // Crown fingers: sinusoidal height variation around ring
      float fingerFreq = uFingers;
      float fingerH    = (sin(angle * fingerFreq) * 0.5 + 0.5); // 0..1
      // Make fingers tapered (taller in the middle, thinner at tip)
      float fingerAmp  = fingerH * fingerH;

      // Lift the top of the torus upward based on phase + finger pattern
      float liftAmount = uCrownHeight * (1.0 + fingerAmp * 0.9);

      // Only lift the upper half of the torus cross-section
      float cross = (normal.y * 0.5 + 0.5); // 0 bottom, 1 top of tube
      transformed.y += liftAmount * cross;

      // Slight outward flare of crown as it rises
      float flare = uPhase * 0.12;
      transformed.xz *= (1.0 + flare * cross);

      vHeightFactor = cross * fingerAmp;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
      varying float vHeightFactor;
      void main() {
      `
    ).replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      // Crystal clear water: dark teal → bright icy white at tips
      vec3 base  = vec3(0.04, 0.12, 0.22);
      vec3 tip   = vec3(0.78, 0.90, 1.00);
      vec3 col   = mix(base, tip, pow(vHeightFactor, 1.5));
      vec4 diffuseColor = vec4(col, opacity);
      `
    );

    matRef.current.userData.shader = shader;
  };

  // Also render a thin disc at y=-1.05 to hide the bottom of the torus
  return (
    <group ref={groupRef} position={[1.8, -1.05, 0]}>
      {/* Base pool ring */}
      <mesh geometry={geometry} ref={meshRef}>
        <meshStandardMaterial
          ref={matRef}
          roughness={0.03}
          metalness={0.9}
          transparent
          opacity={0.9}
          color="#0a2040"
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>

      {/* Inner thin watery sheet between crown spires */}
      <CrownSheet />
    </group>
  );
}

/* Inner crown fill sheet — a thin disc displaced to look like the inner cup */
function CrownSheet() {
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uCrownHeight: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const period = 7.0;
    const local  = (t % period);
    let phase    = 0;
    if (local < 2.0)       phase = local / 2.0;
    else if (local < 3.0)  phase = 1.0;
    else if (local < 5.5)  phase = 1.0 - (local - 3.0) / 2.5;

    const h = Math.pow(phase, 0.5) * 2.8;
    if (matRef.current?.userData?.shader) {
      const sh = matRef.current.userData.shader;
      sh.uniforms.uTime.value        = t;
      sh.uniforms.uCrownHeight.value = h;
    }
  });

  const onBeforeCompile = (shader) => {
    shader.uniforms.uTime        = uniforms.uTime;
    shader.uniforms.uCrownHeight = uniforms.uCrownHeight;

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      uniform float uCrownHeight;
      varying float vR;
      void main() {
      `
    ).replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      float r = length(position.xz);
      vR = r;
      // Cup/bowl shape: edges rise with crown height, centre slightly lower
      float bowl = uCrownHeight * smoothstep(0.0, 1.5, r) * 0.85;
      // Add tiny ripple on the surface
      float ripple = sin(r * 8.0 - uTime * 4.0) * 0.015 * uCrownHeight;
      transformed.y += bowl + ripple;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `
      uniform float uTime;
      varying float vR;
      void main() {
      `
    ).replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      // Transparent glassy water sheet
      vec3 col = mix(vec3(0.02, 0.06, 0.14), vec3(0.5, 0.72, 0.9), smoothstep(0.3, 1.5, vR));
      float a  = mix(0.55, 0.18, smoothstep(0.0, 1.5, vR));
      vec4 diffuseColor = vec4(col, a);
      `
    );

    matRef.current.userData.shader = shader;
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[1.48, 128]} />
      <meshStandardMaterial
        ref={matRef}
        roughness={0.02}
        metalness={0.85}
        transparent
        opacity={0.5}
        color="#061828"
        side={THREE.DoubleSide}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────
   Flying Water Droplets (parabolic arcs upward from crown)
─────────────────────────────────────────────────────── */
function Droplets({ mouse }) {
  const ref = useRef();
  const COUNT = 60;

  const { positions, velocities, lifetimes, sizes } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const lifetimes  = new Float32Array(COUNT);
    const sizes      = new Float32Array(COUNT);
    const origins    = new Float32Array(COUNT * 3); // store in same array

    const init = (i) => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.9;
      positions[i * 3]     = Math.cos(angle) * radius + 1.8;
      positions[i * 3 + 1] = -1.0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const speed = 1.5 + Math.random() * 2.5;
      const angle2 = Math.random() * Math.PI * 2;
      velocities[i * 3]     = Math.cos(angle2) * (0.3 + Math.random() * 0.4);
      velocities[i * 3 + 1] = speed;
      velocities[i * 3 + 2] = Math.sin(angle2) * (0.3 + Math.random() * 0.4);

      lifetimes[i] = Math.random() * -3.0; // stagger start times
      sizes[i]     = 4 + Math.random() * 10;
    };

    for (let i = 0; i < COUNT; i++) init(i);

    return { positions, velocities, lifetimes, sizes, origins, init };
  }, []);

  const posAttr = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const dt = 0.016;

    // Sync with crown phase
    const period = 7.0;
    const local  = (t % period);
    let phase    = 0;
    if (local < 2.0)       phase = local / 2.0;
    else if (local < 3.0)  phase = 1.0;
    else if (local < 5.5)  phase = 1.0 - (local - 3.0) / 2.5;

    for (let i = 0; i < COUNT; i++) {
      lifetimes[i] += dt * (0.5 + Math.random() * 0.1);

      // Droplets only emerge during crown rise phase
      const maxLife = 1.5 + Math.random() * 0.5;
      if (lifetimes[i] > maxLife || lifetimes[i] < 0) {
        if (lifetimes[i] > 0) {
          // Reset
          const angle  = Math.random() * Math.PI * 2;
          const radius = 0.7 + Math.random() * 1.0;
          positions[i * 3]     = Math.cos(angle) * radius + 1.8;
          positions[i * 3 + 1] = -1.05;
          positions[i * 3 + 2] = Math.sin(angle) * radius;

          const speed  = (1.5 + Math.random() * 3.0) * Math.max(phase, 0.3);
          const angle2 = Math.random() * Math.PI * 2;
          velocities[i * 3]     = Math.cos(angle2) * (0.2 + Math.random() * 0.5);
          velocities[i * 3 + 1] = speed;
          velocities[i * 3 + 2] = Math.sin(angle2) * (0.2 + Math.random() * 0.5);
          lifetimes[i] = 0;
        }
        continue;
      }

      const lt = lifetimes[i];
      // Parabolic arc: y = v*t - 0.5*g*t^2
      const g  = 4.5;
      const vx = velocities[i * 3];
      const vy = velocities[i * 3 + 1];
      const vz = velocities[i * 3 + 2];

      positions[i * 3]     += vx * dt;
      positions[i * 3 + 1] += vy * dt - 0.5 * g * dt; // gravity
      positions[i * 3 + 2] += vz * dt;

      // Decelerate velocity
      velocities[i * 3]     *= 0.995;
      velocities[i * 3 + 1] -= g * dt;
      velocities[i * 3 + 2] *= 0.995;
    }

    if (posAttr.current) {
      posAttr.current.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttr}
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
          varying float vLife;
          void main() {
            vLife = clamp(position.y / 2.0, 0.0, 1.0);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying float vLife;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.05, d) * (0.6 + vLife * 0.4);
            gl_FragColor = vec4(0.75, 0.88, 1.0, a * 0.8);
          }
        `}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────
   Full Scene
─────────────────────────────────────────────────────── */
function Scene({ mouse }) {
  return (
    <>
      {/* Cinematic studio lighting matching the reference image */}
      <ambientLight intensity={0.15} color="#102030" />
      <directionalLight position={[4, 8, 3]}   intensity={3.5}  color="#c8e4ff" />
      <directionalLight position={[-5, 4, -2]} intensity={0.8}  color="#1a3a6a" />
      <pointLight       position={[2, 2, 1]}   intensity={4.0}  color="#d0eaff" distance={10} />
      <pointLight       position={[0, -0.5, 0]} intensity={1.5} color="#00223a" distance={6}  />
      {/* Back rim light */}
      <directionalLight position={[-2, 3, -5]} intensity={1.2} color="#4488bb" />

      <Environment preset="studio" />

      <fog attach="fog" color="#020609" near={10} far={28} />

      <WaterSurface />
      <WaterCrown mouse={mouse} />
      <Droplets mouse={mouse} />
    </>
  );
}

/* ──────────────────────────────────────────────────────
   Export
─────────────────────────────────────────────────────── */
export default function BackgroundWaterSplash() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 150);

    const onMove = (e) => {
      // Normalise to -1..1
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(t); window.removeEventListener("mousemove", onMove); };
  }, []);

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 1.2, 7], fov: 52, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        style={{ background: "#020609" }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
