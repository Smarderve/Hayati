"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { DistantCharacters } from "@/src/characters/DistantCharacters";
import { beatAt, localProgress } from "@/src/experience/StoryTimeline";
import { cinematicStore } from "@/src/experience/store";
import { PortalEngine } from "@/src/portals/PortalEngine";
import { Atmosphere } from "@/src/world/Atmosphere";
import { Waterfalls } from "@/src/world/Waterfall";
import { WaterSurface } from "@/src/world/WaterSurface";
import { WorldBackdrop } from "@/src/world/WorldBackdrop";

function CameraChoreography() {
  const getThree = useThree((state) => state.get);
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const { camera, viewport } = getThree();
    const progress = cinematicStore.progress;
    const local = localProgress(progress);
    const portrait = viewport.aspect < 0.8;
    const portalTravel = Math.sin(local * Math.PI);

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      cinematicStore.pointer.x * (portrait ? 0.08 : 0.16) + Math.sin(progress * Math.PI * 10) * 0.12,
      2,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      cinematicStore.pointer.y * 0.06 + Math.sin(progress * Math.PI * 6) * 0.08,
      2,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 8 - portalTravel * 1.55, 2, delta);
    target.current.set(0, -0.15 + portalTravel * 0.12, 0);
    camera.lookAt(target.current);
  });

  return null;
}

function Climate() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const fog = useRef<THREE.FogExp2>(null);

  useFrame(() => {
    const beat = beatAt(cinematicStore.progress);
    if (ambient.current) ambient.current.intensity = 0.42 + beat.warmth * 0.28;
    if (fog.current) {
      fog.current.color.set(beat.storm > 0.5 ? "#07101c" : "#0a1324");
      fog.current.density = 0.025 + beat.storm * 0.018;
    }
  });

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={["#08101e", 0.025]} />
      <ambientLight ref={ambient} color="#aebed8" intensity={0.5} />
      <directionalLight position={[-4, 6, 5]} intensity={1.8} color="#d9e5ff" />
      <pointLight position={[4, -1, 3]} intensity={1.4} color="#e5ad59" />
    </>
  );
}

export function SceneManager() {
  return (
    <>
      <CameraChoreography />
      <Climate />
      <WorldBackdrop />
      <WaterSurface />
      <Waterfalls />
      <PortalEngine />
      <DistantCharacters />
      <Atmosphere />
    </>
  );
}
