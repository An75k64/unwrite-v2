"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, Float, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
   Loaded GLB Model Component with Glass Material
───────────────────────────────────────────────────────── */
function Model({ mousePos }) {
  const groupRef = useRef();
  // Load the GLB model from the public directory
  const { scene } = useGLTF("/models/splash.glb");

  // Create a stunning water/glass material perfectly mimicking the reference image
  const waterMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    thickness: 2.0,
    roughness: 0.05,
    ior: 1.33,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    color: "#ffffff",
    attenuationColor: "#a3c8ff",
    attenuationDistance: 5.0,
    envMapIntensity: 2.5, // Crank up reflections for those bright specular highlights
  }), []);

  // Center the model and apply the custom water material
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material = waterMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Auto-center the geometry
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      // We want the bottom of the splash to be roughly at y=0 or slightly below
      const size = box.getSize(new THREE.Vector3());
      
      scene.position.x = -center.x;
      // Position it so the bottom of the bounding box rests lower on the screen
      scene.position.y = -center.y - (size.y * 0.2); 
      scene.position.z = -center.z;
    }
  }, [scene, waterMaterial]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Smooth mouse follow rotation. Limit the angles so it doesn't break the illusion.
      const targetRotationX = mousePos.current.y * 0.15; // Vertical tilt
      const targetRotationY = mousePos.current.x * 0.3;  // Horizontal pan
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.5}
        rotationIntensity={0.05} // Very subtle rotation
        floatIntensity={0.15} // Very subtle floating so it feels liquid and alive
        floatingRange={[-0.1, 0.1]}
      >
        {/* Scale increased significantly to cover the screen like the reference image */}
        {/* Adjusting scale to 12 based on common viewport framing, we can tweak if needed */}
        <primitive object={scene} scale={12} />
      </Float>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   Studio Lighting Environment for Reflections
───────────────────────────────────────────────────────── */
function StudioLighting() {
  return (
    <>
      <color attach="background" args={["#000000"]} /> // Pitch black background
      
      <Environment resolution={512}>
        {/* Bright overhead softbox for rim lighting - creates the bright edges on the splash */}
        <Lightformer form="rect" intensity={6} position={[0, 10, 0]} scale={[20, 20, 1]} target={[0, 0, 0]} />
        
        {/* Side rim lights for edge definition and specular hits */}
        <Lightformer form="rect" intensity={4} position={[-10, 2, -5]} scale={[10, 20, 1]} target={[0, 0, 0]} color="#baddff" />
        <Lightformer form="rect" intensity={4} position={[10, 2, 5]} scale={[10, 20, 1]} target={[0, 0, 0]} />
        
        {/* Deep blue fill from below to match the dark navy mood */}
        <Lightformer form="circle" intensity={1.5} position={[0, -5, -10]} scale={[20, 20, 1]} target={[0, 0, 0]} color="#001133" />
      </Environment>

      {/* Very subtle ambient fill */}
      <ambientLight intensity={0.1} color="#0a1526" />
      <directionalLight position={[5, 8, 3]} intensity={1.5} color="#e6f2ff" />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export default function BackgroundModel() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => setReady(true), 200);

    const onMouseMove = (e) => {
      // Normalize mouse position from -1 to 1
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 2, 20], fov: 40, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <Model mousePos={mousePos} />
          
          {/* Subtle contact shadow on the floor to ground the splash */}
          <ContactShadows position={[0, -6, 0]} opacity={0.7} scale={30} blur={2.5} far={10} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/splash.glb");
