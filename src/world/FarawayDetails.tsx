"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function FloatingBook({ position, phase, scale = 1 }: { position: [number, number, number]; phase: number; scale?: number }) {
  const book = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!book.current) return;
    const time = state.clock.elapsedTime;
    book.current.position.y = position[1] + Math.sin(time * 0.52 + phase) * 0.22;
    book.current.rotation.y = time * 0.12 + phase;
    book.current.rotation.z = Math.sin(time * 0.31 + phase) * 0.09;
  });
  return (
    <group ref={book} position={position} scale={scale}>
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0.23, 0]}><boxGeometry args={[0.52, 0.72, 0.06]} /><meshStandardMaterial color="#1d2946" metalness={0.45} roughness={0.45} emissive="#b8833d" emissiveIntensity={0.2} /></mesh>
      <mesh position={[0.25, 0, 0]} rotation={[0, -0.23, 0]}><boxGeometry args={[0.52, 0.72, 0.06]} /><meshStandardMaterial color="#eee5d1" roughness={0.92} /></mesh>
      <pointLight position={[0, 0, 0.6]} color="#eecb82" intensity={1.8} distance={3} />
    </group>
  );
}

function HangingCloth({ x }: { x: number }) {
  const cloth = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (cloth.current) cloth.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.42 + x) * 0.12;
  });
  return (
    <mesh ref={cloth} position={[x, 1.15, -1.1]} rotation={[0, 0, x > 0 ? -0.06 : 0.06]}>
      <planeGeometry args={[1.25, 4.7, 10, 22]} />
      <meshStandardMaterial color="#ded8ca" transparent opacity={0.48} side={THREE.DoubleSide} roughness={1} />
    </mesh>
  );
}

export function FarawayDetails() {
  return (
    <>
      <HangingCloth x={-6.3} />
      <HangingCloth x={6.3} />
      <FloatingBook position={[-3.7, 1.45, -13.7]} phase={0.2} scale={0.8} />
      <FloatingBook position={[3.5, 2.05, -16.1]} phase={1.7} scale={0.68} />
      <FloatingBook position={[-2.3, 2.85, -19.1]} phase={3.1} scale={0.54} />
      <FloatingBook position={[2.15, 0.82, -20.4]} phase={4.2} scale={0.48} />
    </>
  );
}
