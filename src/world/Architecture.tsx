"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneConfig } from "@/src/scenes/sceneData";

function Tower({ x, z, height, config }: { x: number; z: number; height: number; config: SceneConfig }) {
  return (
    <group position={[x, -3 + height / 2, z]}>
      <mesh><cylinderGeometry args={[.55, .72, height, 10]} /><meshStandardMaterial color={config.stone} roughness={.8} /></mesh>
      <mesh position={[0, height / 2 + .28, 0]} scale={[.72, .42, .72]}><sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={config.stone} roughness={.72} metalness={.08} /></mesh>
      <mesh position={[0, height / 2 + .82, 0]}><coneGeometry args={[.12, .8, 8]} /><meshStandardMaterial color={config.light} emissive={config.light} emissiveIntensity={.3} /></mesh>
      {[0, 1, 2].map((index) => <mesh key={index} position={[0, -height * .22 + index * .68, .59]} scale={[.13, .22, .03]}><planeGeometry /><meshBasicMaterial color={config.light} toneMapped={false} /></mesh>)}
    </group>
  );
}

function Fountain({ position, color }: { position: [number, number, number]; color: string }) {
  const water = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!water.current) return;
    const pulse = .82 + Math.sin(state.clock.elapsedTime * 2.3 + position[0]) * .12;
    water.current.scale.y = pulse;
    water.current.position.y = .42 + pulse * .32;
  });
  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[.85, 1, .25, 28]} /><meshStandardMaterial color="#777269" roughness={.8} /></mesh>
      <mesh ref={water} position={[0, .75, 0]}><cylinderGeometry args={[.035, .12, 1.5, 10]} /><meshBasicMaterial color={color} transparent opacity={.72} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}

function Bridge({ stone }: { stone: string }) {
  return (
    <group position={[0, -1.8, -6]}>
      <mesh scale={[7.6, .22, 1.15]}><boxGeometry /><meshStandardMaterial color={stone} roughness={.82} /></mesh>
      {[-6.5, -4.2, -1.8, 1.8, 4.2, 6.5].map((x) => <mesh key={x} position={[x, -.8, 0]}><cylinderGeometry args={[.14, .2, 1.7, 10]} /><meshStandardMaterial color={stone} roughness={.85} /></mesh>)}
    </group>
  );
}

function HangingFabric({ x, color }: { x: number; color: string }) {
  const fabric = useRef<THREE.Mesh>(null);
  useFrame((state) => { if (fabric.current) fabric.current.rotation.y = Math.sin(state.clock.elapsedTime * .48 + x) * .14; });
  return <mesh ref={fabric} position={[x, 1.1, -4]}><planeGeometry args={[1.15, 4.8, 8, 24]} /><meshStandardMaterial color={color} transparent opacity={.5} side={THREE.DoubleSide} roughness={1} /></mesh>;
}

export function Architecture({ config, preview = false }: { config: SceneConfig; preview?: boolean }) {
  const towerCount = preview ? 8 : 14;
  const towers = Array.from({ length: towerCount }, (_, index) => {
    const side = index % 2 ? 1 : -1;
    const rank = Math.floor(index / 2);
    return { x: side * (3.8 + (rank % 4) * 1.25), z: -4.5 - rank * 1.65, height: 3.7 + ((index * 7 + config.id) % 5) * .65 };
  });
  return (
    <>
      <Bridge stone={config.stone} />
      {towers.map((tower, index) => <Tower key={index} {...tower} config={config} />)}
      <group position={[0, -1.65, -11]}>
        <mesh scale={[4.4, 2.8, 2.2]}><boxGeometry /><meshStandardMaterial color={config.stone} roughness={.78} /></mesh>
        <mesh position={[0, 1.55, 0]} scale={[2.25, 1.15, 1.75]}><sphereGeometry args={[1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={config.stone} roughness={.7} metalness={.07} /></mesh>
        <pointLight position={[0, 1, 2.5]} color={config.light} intensity={5 + config.warmth * 5} distance={10} />
      </group>
      <Fountain position={[-2.4, -2.85, -2.8]} color={config.light} />
      <Fountain position={[2.4, -2.85, -3.1]} color={config.light} />
      <HangingFabric x={-6.4} color={config.stone} />
      <HangingFabric x={6.4} color={config.stone} />
    </>
  );
}

export function SkyDome({ config }: { config: SceneConfig }) {
  return (
    <>
      <mesh scale={42}><sphereGeometry args={[1, 32, 18]} /><meshBasicMaterial color={config.sky} side={THREE.BackSide} fog={false} /></mesh>
      <mesh position={[4.8, 5.8, -14]}><sphereGeometry args={[2.15, 32, 20]} /><meshBasicMaterial color="#e8edf0" toneMapped={false} /></mesh>
      <mesh position={[0, 1.8, -17]} scale={[22, 8, 1]}><planeGeometry /><meshBasicMaterial color={config.horizon} transparent opacity={.48} depthWrite={false} /></mesh>
    </>
  );
}
