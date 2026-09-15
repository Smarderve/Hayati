"use client";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cinematicStore } from "@/src/experience/store";
import { beatAt } from "@/src/experience/StoryTimeline";

const paths = ["/art/asterra-faraway-master.webp", "/art/approved-cover-reference.webp", "/art/approved-back-reference.webp"];
export function WorldBackdrop() {
  const textures = useTexture(paths);
  const meshes = useRef<THREE.Mesh[]>([]);
  const { viewport } = useThree();
  useFrame((state, delta) => {
    const beat = beatAt(cinematicStore.progress);
    meshes.current.forEach((mesh, index) => {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const active = beat.plate === index;
      material.opacity = THREE.MathUtils.damp(material.opacity, active ? 1 : 0, 3.2, delta);
      mesh.position.x = cinematicStore.pointer.x * (index + 1) * -.08 + Math.sin(cinematicStore.progress * Math.PI * 14) * .12;
      mesh.position.y = cinematicStore.pointer.y * -.05 + (cinematicStore.progress % .05) * 1.2;
      mesh.scale.set(viewport.aspect < .8 ? 15.8 : 18.5, viewport.aspect < .8 ? 11.4 : 10.4, 1);
    });
  });
  return <group position={[0, 0, -8]}>{textures.map((map, index) => <mesh key={paths[index]} ref={(node) => { if (node) meshes.current[index] = node; }} position={[0, 0, -index * .02]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={map} transparent opacity={index ? 0 : 1} toneMapped={false} /></mesh>)}</group>;
}
