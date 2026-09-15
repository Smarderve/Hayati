"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 p = position;
    float wave = sin(p.x * 1.7 + uTime * 0.7) * 0.07 + sin(p.y * 2.9 - uTime) * 0.045;
    p.z += wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  float line(float value, float width) { return 1.0 - smoothstep(0.0, width, abs(value)); }
  void main() {
    float ripple = sin(vUv.y * 115.0 + sin(vUv.x * 19.0) * 4.0 - uTime * 2.4);
    float glint = line(ripple, 0.16) * (0.25 + 0.75 * pow(1.0 - vUv.y, 2.0));
    float path = exp(-pow((vUv.x - 0.5) * 5.2, 2.0));
    vec3 deep = vec3(0.018, 0.075, 0.14);
    vec3 silver = vec3(0.62, 0.76, 0.91);
    vec3 gold = vec3(0.88, 0.65, 0.31);
    vec3 color = mix(deep, silver, glint * 0.42 + max(vWave, 0.0));
    color = mix(color, gold, path * glint * 0.28);
    gl_FragColor = vec4(color, 0.72);
  }
`;

export function LivingWater() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh position={[0, -3.35, -13]} rotation={[-Math.PI / 2, 0, 0]} scale={[28, 62, 1]}>
      <planeGeometry args={[1, 1, 64, 128]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
