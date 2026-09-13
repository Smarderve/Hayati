"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell, smooth } from "@/lib/math";
import { STORY } from "@/lib/narrative";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x),
               mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0; float amp = 0.5;
    for (int i = 0; i < 4; i++) { value += amp * noise(p); p *= 2.03; amp *= 0.48; }
    return value;
  }
  void main() {
    vec2 uv = vUv;
    float edge = smoothstep(0.0, .22, uv.x) * smoothstep(1.0, .78, uv.x)
               * smoothstep(0.0, .25, uv.y) * smoothstep(1.0, .72, uv.y);
    float n = fbm(uv * vec2(3.2, 2.1) + vec2(uTime * .018, 0.0));
    float cloud = smoothstep(.43, .79, n) * edge;
    gl_FragColor = vec4(uColor, cloud * uOpacity);
  }
`;

function CloudLayer({ z, y, scale, speed }: { z: number; y: number; scale: number; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.12 },
      uColor: { value: new THREE.Color("#6b6072") },
    }),
    [],
  );

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const p = experienceStore.progress;
    material.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    const descentCloud = bell(p, STORY.years.focus, STORY.everything.focus, STORY.garden.focus, STORY.playful.focus) * 0.48;
    const letterVeil = bell(p, STORY.future.out, STORY.letter.focus, STORY.letter.out, STORY.return.focus) * 0.2;
    const finalCloud = smooth(p, STORY.return.in, STORY.final.focus) * 0.12;
    const swipeLift = Math.min(0.12, Math.abs(experienceStore.scrollVelocity) * 7);
    material.current.uniforms.uOpacity.value = 0.065 + descentCloud + letterVeil + finalCloud + swipeLift;
    material.current.uniforms.uColor.value.set(p > 0.58 ? "#786574" : "#5f596c");
    mesh.current.position.x = Math.sin(state.clock.elapsedTime * 0.025 + z) * 0.35 + experienceStore.pointer.x * 0.035;
    mesh.current.position.y = y + experienceStore.scrollVelocity * 5 * speed;
  });

  return (
    <mesh ref={mesh} position={[0, y, z]} scale={[scale, scale * 0.58, 1]}>
      <planeGeometry args={[8, 5, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function CloudSystem() {
  return (
    <group>
      <CloudLayer z={3.9} y={-1.1} scale={1.25} speed={0.8} />
      <CloudLayer z={2.5} y={1.45} scale={1.5} speed={0.55} />
      <CloudLayer z={1.2} y={-2.2} scale={1.75} speed={0.38} />
    </group>
  );
}
