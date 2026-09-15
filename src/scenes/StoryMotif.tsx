"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Abdulrahim, StoryPair, Sundus } from "@/src/characters/Characters";
import type { Motif, SceneConfig } from "@/src/scenes/sceneData";

function FloatingBook({ position = [0, .1, -2], open = true, color = "#17213a" }: { position?: [number, number, number]; open?: boolean; color?: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * .62 + position[0]) * .14;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * .27 + position[2]) * .15;
  });
  return (
    <group ref={group} position={position} scale={.72}>
      <mesh position={[-.42, 0, 0]} rotation={[0, open ? .34 : 0, 0]}><boxGeometry args={[.82, 1.16, .07]} /><meshStandardMaterial color={open ? "#eee4ce" : color} roughness={.86} metalness={open ? 0 : .35} /></mesh>
      <mesh position={[.42, 0, 0]} rotation={[0, open ? -.34 : 0, 0]}><boxGeometry args={[.82, 1.16, .07]} /><meshStandardMaterial color={open ? "#eee4ce" : color} roughness={.86} metalness={open ? 0 : .35} /></mesh>
      <pointLight position={[0, 0, .8]} color="#efd08a" intensity={open ? 2.5 : .3} distance={4} />
    </group>
  );
}

function MagicThread({ color = "#efc575", vertical = false }: { color?: string; vertical?: boolean }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => { if (material.current) material.current.opacity = .5 + Math.sin(state.clock.elapsedTime * 2) * .24; });
  return <mesh rotation={[0, 0, vertical ? Math.PI / 2 : 0]} position={[0, -.95, -.45]} scale={[2.55, .025, .025]}><cylinderGeometry args={[1, 1, 1, 10]} /><meshBasicMaterial ref={material} color={color} transparent opacity={.65} toneMapped={false} /></mesh>;
}

function Mirror({ config }: { config: SceneConfig }) {
  const surface = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!surface.current) return;
    const material = surface.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = .18 + Math.sin(state.clock.elapsedTime * 1.2) * .08;
  });
  return (
    <group position={[0, .05, -2.5]}>
      <mesh><torusGeometry args={[2.2, .22, 16, 72]} /><meshStandardMaterial color="#8e744c" metalness={.8} roughness={.25} /></mesh>
      <mesh ref={surface} position={[0, 0, .02]}><circleGeometry args={[1.98, 72]} /><meshStandardMaterial color="#203b5f" emissive={config.light} emissiveIntensity={.2} metalness={.72} roughness={.12} /></mesh>
    </group>
  );
}

function InkStream({ config }: { config: SceneConfig }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(70 * 3);
    for (let i = 0; i < 70; i += 1) {
      const t = i / 69;
      values[i * 3] = -3.4 + t * 6.8;
      values[i * 3 + 1] = -.7 + Math.sin(t * Math.PI * 3) * .55;
      values[i * 3 + 2] = -1.2 + Math.sin(t * Math.PI) * .7;
    }
    return values;
  }, []);
  useFrame((state) => { if (points.current) points.current.rotation.x = Math.sin(state.clock.elapsedTime * .4) * .08; });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color={config.light} size={.085} transparent opacity={.82} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

function ApproachingHands({ config }: { config: SceneConfig }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  useFrame((state) => {
    const gap = .18 + Math.sin(state.clock.elapsedTime * .7) * .04;
    if (left.current) left.current.position.x = -gap;
    if (right.current) right.current.position.x = gap;
  });
  const hand = <><mesh scale={[.22, .52, .13]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#bd9277" roughness={.8} /></mesh>{[-.18, -.06, .06, .18].map((x) => <mesh key={x} position={[x, .47, 0]} scale={[.045, .28, .045]}><capsuleGeometry args={[1, 2, 6, 10]} /><meshStandardMaterial color="#bd9277" roughness={.8} /></mesh>)}</>;
  return (
    <group position={[0, -.5, -1.7]}>
      <group ref={left} rotation={[0, 0, -Math.PI / 2]}>{hand}</group>
      <group ref={right} rotation={[0, 0, Math.PI / 2]}>{hand}</group>
      <pointLight position={[0, 0, .5]} color={config.light} intensity={4} distance={4} />
    </group>
  );
}

function Gate({ config, black = false }: { config: SceneConfig; black?: boolean }) {
  return (
    <group position={[0, .3, -4]}>
      <mesh position={[-2.35, -.6, 0]} scale={[.65, 5.8, 1.1]}><boxGeometry /><meshStandardMaterial color={black ? "#14161c" : config.stone} roughness={.72} /></mesh>
      <mesh position={[2.35, -.6, 0]} scale={[.65, 5.8, 1.1]}><boxGeometry /><meshStandardMaterial color={black ? "#14161c" : config.stone} roughness={.72} /></mesh>
      <mesh position={[0, 2.3, 0]} scale={[2.7, .62, 1.1]}><boxGeometry /><meshStandardMaterial color={black ? "#14161c" : config.stone} roughness={.72} /></mesh>
      <mesh position={[0, -.6, .12]} scale={[3.9, 5.1, .08]}><planeGeometry /><meshStandardMaterial color="#d6e3ef" emissive={config.light} emissiveIntensity={.5} transparent opacity={.38} /></mesh>
    </group>
  );
}

function Home({ config }: { config: SceneConfig }) {
  return <group position={[0, -1.1, -4]}><mesh scale={[4.2, 3.4, 2.7]}><boxGeometry /><meshStandardMaterial color={config.stone} roughness={.8} /></mesh><mesh position={[0, 2.4, 0]} rotation={[0, 0, Math.PI / 4]} scale={[2.4, 2.4, 2.5]}><boxGeometry /><meshStandardMaterial color="#705943" roughness={.9} /></mesh>{[-1.5, 0, 1.5].map(x=><pointLight key={x} position={[x, .2, 1.7]} color={config.light} intensity={4} distance={6}/>)}</group>;
}

export function StoryMotif({ config, preview = false }: { config: SceneConfig; preview?: boolean }) {
  const motif: Motif = config.motif;
  if (motif === "arch") return <Abdulrahim position={[-2.1, -2.25, -1]} rotation={[0, .25, 0]} scale={.58} />;
  if (motif === "books") return <>{[-3.2, -1.2, .8, 2.9].map((x, i) => <FloatingBook key={x} position={[x, .2 + i * .45, -2 - i * .7]} />)}<Abdulrahim position={[-1.5, -2.25, -.8]} scale={.58} /></>;
  if (motif === "palace") return <Sundus position={[3.7, -.8, -5.3]} rotation={[0, -.35, 0]} scale={.45} />;
  if (motif === "ink") return <><FloatingBook position={[-2.8, -.7, -1.5]} /><FloatingBook position={[2.8, -.7, -1.8]} /><InkStream config={config} /></>;
  if (motif === "mirror") return <><Mirror config={config} /><StoryPair distant /></>;
  if (motif === "montage") return <><FloatingBook position={[-2.3, -.5, -1]} /><Mirror config={config} /><StoryPair distant /></>;
  if (motif === "door") return <><Gate config={config} black /><Abdulrahim position={[-2.1, -2.25, -.4]} scale={.56} /><Sundus position={[2.1, -2.25, -1]} scale={.56} /></>;
  if (motif === "garden") return <StoryPair distant />;
  if (motif === "thread") return <><StoryPair distant /><MagicThread color={config.light} /></>;
  if (motif === "moon") return <StoryPair distant />;
  if (motif === "hands") return <><ApproachingHands config={config} /><StoryPair distant /></>;
  if (motif === "silence") return <><FloatingBook position={[-1.8, -1.4, -1]} open={false} /><FloatingBook position={[1.8, -1.4, -1.3]} open={false} /></>;
  if (motif === "return") return <><Mirror config={config} /><StoryPair distant /></>;
  if (motif === "storm") return <><StoryPair distant /><MagicThread color="#a8bdd4" /></>;
  if (motif === "crown") return <><Sundus position={[1.2, -2.25, -1.2]} scale={.62} /><Abdulrahim position={[-2.4, -2.25, -2.4]} scale={.48} /></>;
  if (motif === "gate") return <><Gate config={config} black /><StoryPair distant /></>;
  if (motif === "prayer") return <><Abdulrahim position={[-3, -2.5, -1.2]} rotation={[0, .4, .3]} scale={.48} /><Sundus position={[3, -2.5, -1.4]} rotation={[0, -.4, -.3]} scale={.48} /></>;
  if (motif === "home") return <><Home config={config} /><StoryPair distant /></>;
  if (motif === "years") return <><Gate config={config} /><InkStream config={config} /></>;
  if (motif === "wedding") return <><Gate config={config} /><StoryPair distant />{preview ? null : <MagicThread color={config.light} />}</>;
  return null;
}
