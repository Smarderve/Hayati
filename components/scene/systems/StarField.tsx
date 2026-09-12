"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { smooth } from "@/lib/math";

function seeded(seed: number) {
  const x = Math.sin(seed * 9182.13) * 43758.5453;
  return x - Math.floor(x);
}

export function StarField() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const count = 760;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (seeded(i + 4) - 0.5) * 24;
      values[i * 3 + 1] = (seeded(i + 81) - 0.5) * 18;
      values[i * 3 + 2] = -2 - seeded(i + 190) * 18;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current || !material.current) return;
    const p = experienceStore.progress;
    points.current.rotation.y += delta * 0.0025;
    points.current.position.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.08;
    material.current.opacity = 0.34 + smooth(p, 0.34, 0.55) * 0.2 - smooth(p, 0.78, 0.91) * 0.14;
    material.current.color.set(p > 0.45 && p < 0.82 ? "#ddd0d5" : "#c8cad8");
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        size={0.022}
        color="#c8cad8"
        transparent
        opacity={0.42}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
