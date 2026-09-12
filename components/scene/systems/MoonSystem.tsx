"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { smooth } from "@/lib/math";

export function MoonSystem() {
  const group = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Mesh>(null);
  const texture = useTexture("/assets/lroc_color_2k.jpg");
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!group.current || !moon.current) return;
    const p = experienceStore.progress;
    const portrait = viewport.aspect < 0.8;
    const reveal = smooth(p, 0.015, 0.17);
    const descent = smooth(p, 0.39, 0.58);
    const finale = smooth(p, 0.84, 0.985);

    let scale = THREE.MathUtils.lerp(0.18, portrait ? 2.15 : 2.45, reveal);
    scale = THREE.MathUtils.lerp(scale, portrait ? 1.12 : 1.38, descent);
    scale = THREE.MathUtils.lerp(scale, portrait ? 2.38 : 2.85, finale);

    let x = THREE.MathUtils.lerp(portrait ? 1.15 : 2.1, portrait ? 0.72 : 1.65, reveal);
    let y = THREE.MathUtils.lerp(1.55, portrait ? 0.55 : 0.25, reveal);
    x = THREE.MathUtils.lerp(x, portrait ? 1.28 : 2.15, descent);
    y = THREE.MathUtils.lerp(y, portrait ? 1.58 : 1.12, descent);
    x = THREE.MathUtils.lerp(x, portrait ? 0.18 : 0.48, finale);
    y = THREE.MathUtils.lerp(y, portrait ? 0.62 : 0.28, finale);

    group.current.position.set(x, y, -0.35);
    group.current.scale.setScalar(scale);
    moon.current.rotation.y += delta * (p > 0.86 ? 0.012 : 0.022);
    moon.current.rotation.x = -0.04 + Math.sin(state.clock.elapsedTime * 0.08) * 0.008;
  });

  return (
    <group ref={group}>
      <mesh ref={moon} rotation={[0, -0.42, 0.04]}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.025}
          roughness={0.92}
          metalness={0}
          color="#d8d6db"
        />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#77617f"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
