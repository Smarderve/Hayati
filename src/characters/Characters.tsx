"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type FigureProps = { position: [number, number, number]; rotation?: [number, number, number]; scale?: number };

export function Abdulrahim({ position, rotation = [0, 0, 0], scale = .72 }: FigureProps) {
  const body = useRef<THREE.Group>(null);
  useFrame((state) => { if (body.current) body.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.05) * .008; });
  return (
    <group ref={body} position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, .78, 0]}><sphereGeometry args={[.2, 20, 14]} /><meshStandardMaterial color="#bd9277" roughness={.85} /></mesh>
      <mesh position={[0, .9, -.02]} scale={[1.08, .58, 1]}><sphereGeometry args={[.22, 20, 12]} /><meshStandardMaterial color="#171722" roughness={1} /></mesh>
      <mesh position={[0, .08, 0]}><coneGeometry args={[.5, 1.5, 28]} /><meshStandardMaterial color="#eee8dc" roughness={.83} /></mesh>
      <mesh position={[0, .28, -.23]}><planeGeometry args={[.72, .95]} /><meshStandardMaterial color="#d8d2c8" side={THREE.DoubleSide} roughness={1} /></mesh>
      <mesh position={[0, .3, .47]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.27, .012, 6, 28]} /><meshBasicMaterial color="#c9a15b" toneMapped={false} /></mesh>
    </group>
  );
}

export function Sundus({ position, rotation = [0, 0, 0], scale = .72 }: FigureProps) {
  const body = useRef<THREE.Group>(null);
  const veil = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (body.current) body.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * .98 + 1.4) * .008;
    if (veil.current) veil.current.rotation.y = Math.sin(state.clock.elapsedTime * .52) * .07;
  });
  return (
    <group ref={body} position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, .79, 0]}><sphereGeometry args={[.19, 20, 14]} /><meshStandardMaterial color="#bd9277" roughness={.85} /></mesh>
      <mesh position={[0, .73, -.035]} scale={[1.33, 1.6, 1.05]}><sphereGeometry args={[.24, 22, 14]} /><meshStandardMaterial color="#f4efe5" roughness={.92} /></mesh>
      <mesh position={[0, .06, 0]}><coneGeometry args={[.53, 1.55, 30]} /><meshStandardMaterial color="#f1ece1" roughness={.84} /></mesh>
      <mesh ref={veil} position={[0, .28, -.24]}><planeGeometry args={[.78, 1.1, 8, 14]} /><meshStandardMaterial color="#e5ded2" side={THREE.DoubleSide} roughness={1} /></mesh>
      <mesh position={[0, .2, .49]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.3, .014, 6, 32]} /><meshBasicMaterial color="#d0a85e" toneMapped={false} /></mesh>
    </group>
  );
}

export function StoryPair({ distant = false }: { distant?: boolean }) {
  const scale = distant ? .46 : .68;
  return <><Abdulrahim position={[-1.35, -2.27, -1]} rotation={[0, .35, 0]} scale={scale} /><Sundus position={[1.35, -2.27, -1.1]} rotation={[0, -.35, 0]} scale={scale} /></>;
}
