"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell, smooth } from "@/lib/math";
import { FUTURE_MOMENTS, STORY } from "@/lib/narrative";

function curveTube(points: THREE.Vector3[], radius = 0.012) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 56, radius, 6, false);
}

function fade(group: THREE.Group | null, opacity: number) {
  if (!group) return;
  group.visible = opacity > 0.002;
  group.scale.setScalar(0.84 + opacity * 0.16);
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const material = object.material as THREE.Material & { opacity?: number };
    if (typeof material.opacity === "number") material.opacity = opacity;
  });
}

export function FutureEnvironment() {
  const group = useRef<THREE.Group>(null);
  const path = useRef<THREE.MeshBasicMaterial>(null);
  const promise = useRef<THREE.Group>(null);
  const horizon = useRef<THREE.Group>(null);
  const shelter = useRef<THREE.Group>(null);
  const family = useRef<THREE.Group>(null);
  const dreams = useRef<THREE.Group>(null);
  const timeTree = useRef<THREE.Group>(null);
  const pathGeometry = useMemo(() => curveTube([
    new THREE.Vector3(-2.4, -2.06, 2.1), new THREE.Vector3(-1.2, -1.82, 1.2),
    new THREE.Vector3(-0.25, -1.54, 0.25), new THREE.Vector3(0.82, -1.3, -1.3),
    new THREE.Vector3(2.25, -1.16, -3.2),
  ]), []);
  const dreamGeometry = useMemo(() => curveTube([
    new THREE.Vector3(-0.45, -0.5, 0), new THREE.Vector3(-0.18, 0.1, 0),
    new THREE.Vector3(0.1, 0.48, 0), new THREE.Vector3(0.46, 1.15, 0),
  ], 0.009), []);

  useFrame((state) => {
    const p = experienceStore.progress;
    const world = bell(p, STORY.future.in - 0.035, STORY.future.in, STORY.letter.in + 0.07, STORY.letter.out);
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(-0.6, 0, world);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.018 + experienceStore.pointer.x * 0.018;
      group.current.visible = world > 0.002;
    }
    if (path.current) path.current.opacity = world * 0.52;
    fade(promise.current, bell(p, FUTURE_MOMENTS.promise[0], FUTURE_MOMENTS.promise[1], 0.555, 0.58));
    fade(horizon.current, bell(p, FUTURE_MOMENTS.journey[0], FUTURE_MOMENTS.journey[1], 0.595, 0.62));
    fade(shelter.current, bell(p, FUTURE_MOMENTS.home[0], FUTURE_MOMENTS.home[1], 0.635, 0.66));
    fade(family.current, bell(p, FUTURE_MOMENTS.family[0], FUTURE_MOMENTS.family[1], 0.675, 0.70));
    fade(dreams.current, bell(p, FUTURE_MOMENTS.dreams[0], FUTURE_MOMENTS.dreams[1], 0.715, 0.74));
    fade(timeTree.current, bell(p, FUTURE_MOMENTS.years[0], FUTURE_MOMENTS.years[1], 0.755, 0.79));
    if (promise.current) promise.current.rotation.z = state.clock.elapsedTime * 0.035;
    if (horizon.current) horizon.current.position.x = -1.1 + smooth(p, ...FUTURE_MOMENTS.journey) * 0.34;
    if (dreams.current) dreams.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 0.32) * 0.025;
  });

  return (
    <group ref={group}>
      <mesh geometry={pathGeometry}><meshBasicMaterial ref={path} color="#b49ba8" transparent opacity={0} depthWrite={false} /></mesh>

      <group ref={promise} position={[-1.65, -0.15, 0.45]}>
        <mesh rotation={[0.12, 0.35, 0]}><torusGeometry args={[0.39, 0.013, 8, 72]} /><meshBasicMaterial color="#d7c5cc" transparent opacity={0} /></mesh>
        <mesh position={[0.42, 0.03, -0.08]} rotation={[-0.08, -0.28, 0]}><torusGeometry args={[0.39, 0.013, 8, 72]} /><meshBasicMaterial color="#ad94b4" transparent opacity={0} /></mesh>
      </group>

      <group ref={horizon} position={[-1.1, -0.1, -0.3]}>
        <mesh rotation={[Math.PI / 2, 0, -0.28]}><torusGeometry args={[0.72, 0.008, 6, 80, Math.PI * 1.05]} /><meshBasicMaterial color="#a994a5" transparent opacity={0} /></mesh>
        {[0, 1, 2, 3].map((index) => <mesh key={index} position={[index * 0.24 - 0.32, index * 0.13 - 0.04, -index * 0.08]}><sphereGeometry args={[index === 3 ? 0.026 : 0.014, 8, 8]} /><meshBasicMaterial color={index === 3 ? "#ead9cf" : "#887888"} transparent opacity={0} /></mesh>)}
      </group>

      <group ref={shelter} position={[1.25, -1.1, -0.8]}>
        <mesh position={[0, 0.38, 0]}><boxGeometry args={[1.14, 0.78, 0.08]} /><meshBasicMaterial color="#0c090f" transparent opacity={0} /></mesh>
        <mesh position={[0, 0.93, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.82, 0.82, 0.065]} /><meshBasicMaterial color="#0c090f" transparent opacity={0} /></mesh>
        <mesh position={[-0.21, 0.42, 0.06]}><planeGeometry args={[0.23, 0.31]} /><meshBasicMaterial color="#d2a477" transparent opacity={0} /></mesh>
        <mesh position={[0.29, 0.51, 0.065]}><planeGeometry args={[0.2, 0.18]} /><meshBasicMaterial color="#cdb3a5" transparent opacity={0} /></mesh>
      </group>

      <group ref={family} position={[0.65, -0.45, 0.35]}>
        {([[-0.24, 0.04, 0.052, "#efe0d4"], [0.22, 0.01, 0.052, "#d7c3da"], [-0.04, -0.18, 0.032, "#e4bd98"], [0.08, -0.23, 0.027, "#d6bdc8"]] as const).map(([x, y, radius, color], index) => <mesh key={index} position={[x, y, index * -0.03]}><sphereGeometry args={[radius, 14, 14]} /><meshBasicMaterial color={color} transparent opacity={0} /></mesh>)}
      </group>

      <group ref={dreams} position={[-0.05, -0.1, -0.7]}>
        <mesh geometry={dreamGeometry} position={[-0.18, -0.75, 0]}><meshBasicMaterial color="#b8a0b7" transparent opacity={0} /></mesh>
        <mesh geometry={dreamGeometry} position={[0.14, -0.82, -0.06]} scale={[0.82, 0.92, 1]}><meshBasicMaterial color="#dac5c2" transparent opacity={0} /></mesh>
        <mesh position={[0.34, 0.37, 0]} rotation={[0, 0, -0.6]}><circleGeometry args={[0.105, 18]} /><meshBasicMaterial color="#b893a8" transparent opacity={0} side={THREE.DoubleSide} /></mesh>
      </group>

      <group ref={timeTree} position={[-1.25, -1.35, -1.1]}>
        <mesh position={[0, 0.69, 0]}><cylinderGeometry args={[0.055, 0.11, 1.4, 9]} /><meshStandardMaterial color="#161019" roughness={1} transparent opacity={0} /></mesh>
        {[0.44, 0.68, 0.91].map((radius, index) => <mesh key={radius} position={[0, 1.25, -index * 0.02]} rotation={[0, 0, index * 0.4]}><torusGeometry args={[radius, 0.012, 6, 64]} /><meshBasicMaterial color={index === 2 ? "#785e75" : "#9b7d91"} transparent opacity={0} /></mesh>)}
        <PairedLights />
      </group>
    </group>
  );
}

function PairedLights() {
  const first = useRef<THREE.Mesh>(null);
  const second = useRef<THREE.Mesh>(null);
  const glowA = useRef<THREE.MeshBasicMaterial>(null);
  const glowB = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    const visible = bell(experienceStore.progress, 0.44, 0.48, 0.77, 0.82);
    const still = Math.max(0, experienceStore.stillness);
    const t = state.clock.elapsedTime;
    const closeness = 0.12 * still;
    if (first.current) first.current.position.set(-0.17 + closeness + Math.sin(t * 0.7) * 0.025, 0.03, 0.08);
    if (second.current) second.current.position.set(0.17 - closeness + Math.sin(t * 0.7 + 2) * 0.025, 0, 0.08);
    if (glowA.current) glowA.current.opacity = visible * (0.56 + still * 0.34);
    if (glowB.current) glowB.current.opacity = visible * (0.5 + still * 0.34);
  });
  return <group position={[0, 0.12, 0]}><mesh ref={first}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial ref={glowA} color="#eadbcf" transparent opacity={0} /></mesh><mesh ref={second}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial ref={glowB} color="#cbb6d1" transparent opacity={0} /></mesh></group>;
}
