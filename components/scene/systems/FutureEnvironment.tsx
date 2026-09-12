"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { bell } from "@/lib/math";

export function FutureEnvironment() {
  const group = useRef<THREE.Group>(null);
  const materials = useRef<THREE.Material[]>([]);
  const pathGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.5, -2.25, 2.2),
      new THREE.Vector3(-0.4, -1.95, 1.2),
      new THREE.Vector3(0.2, -1.5, 0),
      new THREE.Vector3(0.72, -1.08, -2.8),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.015, 5, false);
  }, []);

  useFrame((state) => {
    const p = experienceStore.progress;
    const visible = bell(p, 0.59, 0.66, 0.82, 0.91);
    materials.current.forEach((material) => {
      if ("opacity" in material) (material as THREE.Material & { opacity: number }).opacity = visible;
    });
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(-0.45, 0, visible);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.045) * 0.012;
    }
  });

  const rememberMaterial = (material: THREE.Material | null) => {
    if (material && !materials.current.includes(material)) materials.current.push(material);
  };

  return (
    <group ref={group}>
      <mesh geometry={pathGeometry}>
        <meshBasicMaterial ref={rememberMaterial} color="#9a7e91" transparent opacity={0} />
      </mesh>

      <group position={[1.45, -1.16, -1.3]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.82, 0.55, 0.12]} />
          <meshBasicMaterial ref={rememberMaterial} color="#0b090d" transparent opacity={0} />
        </mesh>
        <mesh position={[-0.08, 0.22, 0.075]}>
          <planeGeometry args={[0.17, 0.23]} />
          <meshBasicMaterial ref={rememberMaterial} color="#d3a77e" transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.59, 0.59, 0.1]} />
          <meshBasicMaterial ref={rememberMaterial} color="#0b090d" transparent opacity={0} />
        </mesh>
      </group>

      <group position={[-1.25, -1.35, -0.7]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.13, 1.25, 7]} />
          <meshStandardMaterial ref={rememberMaterial} color="#141017" transparent opacity={0} roughness={1} />
        </mesh>
        {[
          [-0.38, 1.05, -0.35],
          [0.34, 1.18, 0.26],
          [-0.08, 1.42, 0.12],
        ].map(([x, y, r], index) => (
          <mesh key={index} position={[x, y, 0]} rotation={[0, 0, r]}>
            <sphereGeometry args={[0.48 - index * 0.035, 8, 7]} />
            <meshStandardMaterial
              ref={rememberMaterial}
              color="#19131c"
              emissive="#241426"
              emissiveIntensity={0.3}
              transparent
              opacity={0}
              roughness={1}
            />
          </mesh>
        ))}
      </group>

      <PairedLights />
    </group>
  );
}

function PairedLights() {
  const first = useRef<THREE.Mesh>(null);
  const second = useRef<THREE.Mesh>(null);
  const materialA = useRef<THREE.MeshBasicMaterial>(null);
  const materialB = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const p = experienceStore.progress;
    const visible = bell(p, 0.52, 0.56, 0.69, 0.75);
    const pointer = experienceStore.pointer;
    const t = state.clock.elapsedTime;
    if (first.current) first.current.position.set(-0.24 + Math.sin(t * 0.8) * 0.06, -0.4 + Math.cos(t * 0.7) * 0.04, 2.4);
    if (second.current) {
      const follow = pointer.active ? pointer.x * 0.08 : 0;
      second.current.position.set(0.22 + Math.sin(t * 0.8 + 1.8) * 0.06 + follow, -0.38 + Math.cos(t * 0.72) * 0.04, 2.4);
    }
    if (materialA.current) materialA.current.opacity = visible;
    if (materialB.current) materialB.current.opacity = visible;
  });

  return (
    <>
      <mesh ref={first}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial ref={materialA} color="#eadbcf" transparent opacity={0} />
      </mesh>
      <mesh ref={second}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial ref={materialB} color="#cbb6d1" transparent opacity={0} />
      </mesh>
    </>
  );
}
