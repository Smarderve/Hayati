"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PortalSurface } from "@/src/portals/PortalSurface";

function createArch() {
  const outer = new THREE.Shape();
  outer.moveTo(-2.62, -3.65);
  outer.lineTo(-2.62, 0.75);
  outer.bezierCurveTo(-2.62, 2.45, -1.12, 3.55, 0, 3.95);
  outer.bezierCurveTo(1.12, 3.55, 2.62, 2.45, 2.62, 0.75);
  outer.lineTo(2.62, -3.65);
  outer.lineTo(2.02, -3.65);
  outer.lineTo(2.02, 0.66);
  outer.bezierCurveTo(2.02, 1.96, 0.92, 2.91, 0, 3.26);
  outer.bezierCurveTo(-0.92, 2.91, -2.02, 1.96, -2.02, 0.66);
  outer.lineTo(-2.02, -3.65);
  outer.closePath();
  return outer;
}

export function EnchantedArch({ destination }: { destination: THREE.Texture }) {
  const frame = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(createArch(), { depth: 0.42, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.08, bevelThickness: 0.08 }), []);
  useFrame((state) => {
    if (frame.current) frame.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.21) * 0.0025;
  });
  return (
    <group>
      <PortalSurface texture={destination} rect={[0.015, 0.03, 0.472, 0.94]} position={[0, 0.08, 0.11]} scale={[5.05, 7.35, 1]} kind="arch" />
      <mesh ref={frame} geometry={geometry} position={[0, 0, 0.28]}>
        <meshStandardMaterial color="#8a806f" roughness={0.72} metalness={0.08} emissive="#7b5529" emissiveIntensity={0.11} />
      </mesh>
      <pointLight position={[0, 0.4, 1.1]} color="#eac27d" intensity={8} distance={7} decay={2} />
      <mesh position={[0, 3.78, 0.76]} rotation={[0, 0, Math.PI / 4]} scale={[0.13, 0.13, 0.13]}>
        <octahedronGeometry />
        <meshBasicMaterial color="#fff0bc" toneMapped={false} />
      </mesh>
    </group>
  );
}
