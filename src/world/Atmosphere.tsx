"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/store";

const PARTICLE_COUNT = 480;

function noise(index: number) {
  const value = Math.sin(index * 91.173 + 17.719) * 43758.5453;
  return value - Math.floor(value);
}

export function Atmosphere() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(PARTICLE_COUNT * 3);
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      values[index * 3] = (noise(index * 3) - 0.5) * 18;
      values[index * 3 + 1] = (noise(index * 3 + 1) - 0.5) * 11;
      values[index * 3 + 2] = -6 + noise(index * 3 + 2) * 11;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.004;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    const material = points.current.material as THREE.PointsMaterial;
    material.opacity = 0.28 + Math.min(0.24, Math.abs(cinematicStore.velocity) * 12);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f0d9aa" size={0.018} transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}
