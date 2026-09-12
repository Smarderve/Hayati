"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { experienceStore } from "@/lib/experience-store";
import { smooth } from "@/lib/math";
import { MoonSystem } from "./systems/MoonSystem";
import { StarField } from "./systems/StarField";
import { CloudSystem } from "./systems/CloudSystem";
import { GardenEnvironment } from "./systems/GardenEnvironment";
import { FutureEnvironment } from "./systems/FutureEnvironment";

function CinematicCamera() {
  const viewport = useThree((state) => state.viewport);
  const getThree = useThree((state) => state.get);
  const target = new THREE.Vector3();

  useFrame((_, delta) => {
    const camera = getThree().camera;
    const p = experienceStore.progress;
    const pointer = experienceStore.pointer;
    const portrait = viewport.aspect < 0.8;
    const final = smooth(p, 0.88, 0.98);
    const desiredX = pointer.x * (portrait ? 0.08 : 0.14) * (1 - final);
    const desiredY = pointer.y * 0.06 * (1 - final) + THREE.MathUtils.lerp(0, 0.12, final);
    const desiredZ = THREE.MathUtils.lerp(7, 6.25, smooth(p, 0.08, 0.44));
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 2.1, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 2.1, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 1.6, delta);
    target.set(0, THREE.MathUtils.lerp(-0.05, 0.12, final), 0);
    camera.lookAt(target);
  });

  return null;
}

function LightingRig() {
  const light = new THREE.Color();
  useFrame(({ scene }) => {
    const p = experienceStore.progress;
    light.set("#050407").lerp(new THREE.Color("#0d0912"), smooth(p, 0.32, 0.74));
    scene.background = light;
  });

  return (
    <>
      <ambientLight intensity={0.08} color="#81778d" />
      <directionalLight position={[-4, 3, 6]} intensity={2.9} color="#e4e3ec" />
      <pointLight position={[3, -1, 3]} intensity={0.45} color="#6d426f" distance={10} />
    </>
  );
}

export function World() {
  return (
    <>
      <fog attach="fog" args={["#08060b", 7, 20]} />
      <CinematicCamera />
      <LightingRig />
      <StarField />
      <MoonSystem />
      <CloudSystem />
      <GardenEnvironment />
      <FutureEnvironment />
    </>
  );
}
