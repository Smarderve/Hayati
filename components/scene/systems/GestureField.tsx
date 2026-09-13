"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell } from "@/lib/math";

const COUNT = 36;

function seeded(index: number) {
  const value = Math.sin(index * 41.73) * 43758.5453;
  return value - Math.floor(value);
}

export function GestureField() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const positionAttribute = useRef<THREE.BufferAttribute>(null);
  const seenTap = useRef(0);
  const life = useRef(0);
  const origin = useRef(new THREE.Vector3());
  const velocities = useRef(new Float32Array(COUNT * 3));

  useFrame((_, delta) => {
    if (!points.current || !material.current) return;
    const attribute = positionAttribute.current;
    if (!attribute) return;
    const positions = attribute.array as Float32Array;
    const motion = velocities.current;
    if (seenTap.current !== experienceStore.tapPulse) {
      seenTap.current = experienceStore.tapPulse;
      life.current = 1;
      origin.current.set(experienceStore.pointer.x * 3.1, experienceStore.pointer.y * 2.15, 2.2);
      for (let index = 0; index < COUNT; index += 1) {
        const angle = seeded(index + seenTap.current * 7) * Math.PI * 2;
        const speed = 0.34 + seeded(index + 81) * 0.72;
        const i = index * 3;
        positions[i] = origin.current.x;
        positions[i + 1] = origin.current.y;
        positions[i + 2] = origin.current.z + (seeded(index + 17) - 0.5) * 0.25;
        motion[i] = Math.cos(angle) * speed;
        motion[i + 1] = Math.sin(angle) * speed;
        motion[i + 2] = (seeded(index + 37) - 0.5) * 0.28;
      }
    }

    if (life.current > 0) {
      life.current = Math.max(0, life.current - delta * 0.72);
      for (let index = 0; index < COUNT; index += 1) {
        const i = index * 3;
        positions[i] += motion[i] * delta;
        positions[i + 1] += motion[i + 1] * delta;
        positions[i + 2] += motion[i + 2] * delta;
        motion[i] *= Math.pow(0.2, delta);
        motion[i + 1] = motion[i + 1] * Math.pow(0.25, delta) + delta * 0.025;
      }
      attribute.needsUpdate = true;
    }

    const inPlayfulWorld = bell(experienceStore.progress, 0.42, 0.48, 0.77, 0.84);
    material.current.opacity = life.current * inPlayfulWorld * 0.65;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={positionAttribute} attach="attributes-position" args={[new Float32Array(COUNT * 3), 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color="#eadbe2"
        size={0.035}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
