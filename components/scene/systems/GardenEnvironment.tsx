"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell } from "@/lib/math";

function seeded(seed: number) {
  const x = Math.sin(seed * 73.17) * 9137.31;
  return x - Math.floor(x);
}

export function GardenEnvironment() {
  const group = useRef<THREE.Group>(null);
  const stems = useRef<THREE.InstancedMesh>(null);
  const blooms = useRef<THREE.InstancedMesh>(null);
  const dust = useRef<THREE.Points>(null);
  const stemMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const bloomMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const groundMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const count = 54;
  const dustPositions = useMemo(() => {
    const values = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      values[i * 3] = (seeded(i + 300) - 0.5) * 11;
      values[i * 3 + 1] = -2 + seeded(i + 512) * 3.8;
      values[i * 3 + 2] = 1.2 - seeded(i + 773) * 5;
    }
    return values;
  }, []);

  useEffect(() => {
    if (!stems.current || !blooms.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    for (let i = 0; i < count; i += 1) {
      const x = (seeded(i + 4) - 0.5) * 11;
      const z = 2 - seeded(i + 72) * 5;
      const height = 0.45 + seeded(i + 130) * 1.25;
      position.set(x, -2.45 + height * 0.5, z);
      quaternion.setFromEuler(new THREE.Euler(0, 0, (seeded(i + 99) - 0.5) * 0.16));
      scale.set(0.7 + seeded(i + 8) * 0.8, height, 0.7 + seeded(i + 9) * 0.8);
      matrix.compose(position, quaternion, scale);
      stems.current.setMatrixAt(i, matrix);

      const bloomScale = 0.055 + seeded(i + 160) * 0.09;
      position.set(x, -2.42 + height, z);
      quaternion.setFromEuler(new THREE.Euler(seeded(i) * 0.4, seeded(i + 1) * 3, 0));
      scale.setScalar(bloomScale);
      matrix.compose(position, quaternion, scale);
      blooms.current.setMatrixAt(i, matrix);
    }
    stems.current.instanceMatrix.needsUpdate = true;
    blooms.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const p = experienceStore.progress;
    const visible = bell(p, 0.40, 0.50, 0.76, 0.86);
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(-0.7, 0, visible);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.035) * 0.018;
    }
    if (stemMaterial.current) stemMaterial.current.opacity = visible * 0.76;
    if (bloomMaterial.current) bloomMaterial.current.opacity = visible * 0.78;
    if (groundMaterial.current) groundMaterial.current.opacity = visible * 0.45;
    if (dust.current) {
      (dust.current.material as THREE.PointsMaterial).opacity = visible * 0.4;
      dust.current.rotation.y = state.clock.elapsedTime * 0.012;
      dust.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.07;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={stems} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.018, 0.028, 1, 5]} />
        <meshStandardMaterial ref={stemMaterial} color="#14111a" transparent opacity={0} roughness={1} />
      </instancedMesh>
      <instancedMesh ref={blooms} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={bloomMaterial}
          color="#4c304d"
          emissive="#271427"
          emissiveIntensity={0.7}
          transparent
          opacity={0}
          roughness={0.9}
        />
      </instancedMesh>
      <mesh position={[0, -2.52, -1.5]} rotation={[-Math.PI / 2, 0, 0]} scale={[9, 8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={groundMaterial} color="#08070a" transparent opacity={0} />
      </mesh>
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c0a3ad" size={0.025} transparent opacity={0} depthWrite={false} />
      </points>
    </group>
  );
}
