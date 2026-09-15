"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Abdulrahim({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const figure = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (figure.current) figure.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.75) * 0.012;
  });
  return (
    <group ref={figure} position={position} rotation={rotation} scale={0.58}>
      <mesh position={[0, 0.72, 0]}><sphereGeometry args={[0.2, 18, 12]} /><meshStandardMaterial color="#cba98e" roughness={0.9} /></mesh>
      <mesh position={[0, 0.84, -0.02]} scale={[1.1, 0.6, 1]}><sphereGeometry args={[0.21, 18, 10]} /><meshStandardMaterial color="#171923" roughness={1} /></mesh>
      <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.48, 1.35, 24]} /><meshStandardMaterial color="#eee8d9" roughness={0.82} /></mesh>
      <mesh position={[0, 0.38, -0.18]} rotation={[-0.14, 0, 0]}><planeGeometry args={[0.7, 0.78]} /><meshStandardMaterial color="#d7d2c7" side={THREE.DoubleSide} roughness={0.9} /></mesh>
    </group>
  );
}

function Sundus({ position }: { position: [number, number, number] }) {
  const veil = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (veil.current) veil.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.56) * 0.08;
  });
  return (
    <group position={position} scale={0.54} rotation={[0, -0.45, 0]}>
      <mesh position={[0, 0.72, 0]}><sphereGeometry args={[0.19, 18, 12]} /><meshStandardMaterial color="#cba98e" roughness={0.9} /></mesh>
      <mesh position={[0, 0.67, -0.025]} scale={[1.3, 1.55, 1]}><sphereGeometry args={[0.23, 20, 14]} /><meshStandardMaterial color="#f3eee3" roughness={0.92} /></mesh>
      <mesh position={[0, 0.04, 0]}><coneGeometry args={[0.51, 1.42, 28]} /><meshStandardMaterial color="#f2eee2" roughness={0.82} /></mesh>
      <mesh ref={veil} position={[0, 0.29, -0.22]}><planeGeometry args={[0.75, 1.03, 8, 10]} /><meshStandardMaterial color="#e8e1d3" side={THREE.DoubleSide} roughness={0.9} /></mesh>
      <mesh position={[0, 0.12, 0.48]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27, 0.015, 8, 30]} /><meshBasicMaterial color="#d6ad62" toneMapped={false} /></mesh>
    </group>
  );
}

export function StoryFigures() {
  return (
    <>
      <Abdulrahim position={[-2.1, -2.52, 2.1]} rotation={[0, 0.32, 0]} />
      <Abdulrahim position={[-1.6, -2.52, -18.2]} rotation={[0, 0.12, 0]} />
      <Sundus position={[4.55, -1.15, -42.3]} />
    </>
  );
}
