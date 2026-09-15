"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PortalSurface } from "@/src/portals/PortalSurface";

function TurningPage({ index }: { index: number }) {
  const page = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!page.current) return;
    page.current.rotation.y = -0.34 + Math.sin(state.clock.elapsedTime * 0.55 + index * 1.7) * 0.22;
    page.current.position.y = Math.sin(state.clock.elapsedTime * 0.43 + index) * 0.04;
  });
  return (
    <mesh ref={page} position={[0.15 + index * 0.035, 0.1, 0.18 + index * 0.018]} rotation={[0, -0.34, 0]}>
      <planeGeometry args={[4.2, 2.7, 16, 8]} />
      <meshStandardMaterial color="#eee4cc" roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.68} />
    </mesh>
  );
}

export function LivingBookPortal({ destination }: { destination: THREE.Texture }) {
  const book = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!book.current) return;
    book.current.position.y = 0.18 + Math.sin(state.clock.elapsedTime * 0.48) * 0.13;
    book.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.31) * 0.018;
  });
  return (
    <group ref={book} position={[0, 0.18, -23.68]}>
      <mesh position={[0, -0.08, -0.08]} scale={[4.9, 3.25, 0.18]}>
        <boxGeometry />
        <meshStandardMaterial color="#17213a" metalness={0.55} roughness={0.43} emissive="#8d632d" emissiveIntensity={0.12} />
      </mesh>
      <PortalSurface texture={destination} rect={[0.513, 0.03, 0.472, 0.94]} position={[0, 0.05, 0.19]} scale={[4.52, 2.84, 1]} kind="page" />
      {[0, 1, 2].map((index) => <TurningPage key={index} index={index} />)}
      <mesh position={[0, 0.02, 0.42]} scale={[0.035, 2.82, 0.04]}><boxGeometry /><meshBasicMaterial color="#f3cc7b" toneMapped={false} /></mesh>
      <pointLight position={[0, 0.4, 1.2]} intensity={10} distance={8} color="#f0c477" />
    </group>
  );
}
