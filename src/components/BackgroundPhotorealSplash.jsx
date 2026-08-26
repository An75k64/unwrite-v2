"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Simplex Noise GLSL ─────────────────────────────────────────────────── */
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.y  = a0.y  * x12.x + h.y  * x12.y;
  g.z  = a0.z  * x12.z + h.z  * x12.w;
  return 130.0 * dot(m, g);
}
`;

/* ─────────────────────────────────────────────────────────────────────────
   Photoreal Splash Displacement
───────────────────────────────────────────────────────────────────────── */
function PhotorealSplash({ texture, mouse }) {
  const meshRef = useRef();
  const matRef = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uIntensity: { value: 0.02 }, // Distortion strength
  }), [texture]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      // Smoothly interpolate mouse for fluid drag effect
      matRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        matRef.current.uniforms.uMouse.value.x,
        mouse.current.x,
        0.05
      );
      matRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        matRef.current.uniforms.uMouse.value.y,
        mouse.current.y,
        0.05
      );
    }
  });

  const handleResize = () => {
    if (matRef.current) {
      matRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <mesh ref={meshRef}>
      {/* Cover the entire viewport */}
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform sampler2D uTexture;
          uniform vec2 uMouse;
          uniform vec2 uResolution;
          uniform float uIntensity;
          varying vec2 vUv;
          
          ${NOISE_GLSL}
          
          void main() {
            vec2 uv = vUv;
            
            // Adjust UV to cover and maintain aspect ratio of screen vs image
            // Assuming image is roughly 16:9 like the reference
            float imgAspect = 16.0 / 9.0;
            float screenAspect = uResolution.x / uResolution.y;
            vec2 scale = vec2(1.0);
            if (screenAspect > imgAspect) {
              scale.y = screenAspect / imgAspect;
            } else {
              scale.x = imgAspect / screenAspect;
            }
            
            // Center the image
            vec2 scaledUv = (uv - 0.5) * scale + 0.5;
            
            // Mouse distortion distance
            float dist = distance(uv, uMouse * 0.5 + 0.5);
            float mouseSwell = smoothstep(0.4, 0.0, dist) * 0.03;
            
            // Apply fluid noise displacement to UV coordinates
            float noiseTime = uTime * 0.2;
            vec2 noiseUv = scaledUv * 3.0;
            
            float displacementX = snoise(noiseUv + vec2(noiseTime, 0.0)) * uIntensity;
            float displacementY = snoise(noiseUv + vec2(0.0, noiseTime)) * uIntensity;
            
            // Add distortion where mouse is
            vec2 dir = normalize(uv - (uMouse * 0.5 + 0.5));
            vec2 finalDistortion = vec2(displacementX, displacementY) + (dir * mouseSwell);
            
            // Sample texture with displaced UVs
            vec4 color = texture2D(uTexture, clamp(scaledUv + finalDistortion, 0.0, 1.0));
            
            // Add subtle chromatic aberration on the edges of distortion
            float r = texture2D(uTexture, clamp(scaledUv + finalDistortion * 1.5, 0.0, 1.0)).r;
            float b = texture2D(uTexture, clamp(scaledUv + finalDistortion * 0.5, 0.0, 1.0)).b;
            color.r = r;
            color.b = b;
            
            // Darken slightly for the text to pop
            color.rgb *= 0.85;
            
            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────────────────────── */
export default function BackgroundPhotorealSplash() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    // Load the texture manually
    const loader = new THREE.TextureLoader();
    loader.load('/water-splash.png', (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexture(tex);
      setReady(true);
    });

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (!ready || !texture) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        style={{ background: "#05070a" }} // dark navy base
      >
        <Suspense fallback={null}>
          <PhotorealSplash texture={texture} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
