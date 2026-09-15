"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec4 uRect;
  uniform float uTime;
  uniform float uLight;
  varying vec2 vUv;
  void main() {
    vec2 sampleUv = uRect.xy + vUv * uRect.zw;
    sampleUv.x += sin(vUv.y * 5.0 + uTime * 0.035) * 0.0016;
    vec4 color = texture2D(uMap, sampleUv);
    color.rgb *= uLight;
    gl_FragColor = color;
  }
`;

type ScenicPlateProps = {
  texture: THREE.Texture;
  rect?: [number, number, number, number];
  position: [number, number, number];
  size?: [number, number];
  light?: number;
};

export function ScenicPlate({ texture, rect = [0, 0, 1, 1], position, size = [24, 13.5], light = 0.9 }: ScenicPlateProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uRect: { value: new THREE.Vector4(...rect) },
    uTime: { value: 0 },
    uLight: { value: light },
  }), [texture, rect, light]);

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position} scale={[size[0], size[1], 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} toneMapped={false} />
    </mesh>
  );
}
