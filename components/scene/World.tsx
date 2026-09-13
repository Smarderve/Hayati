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
import { GestureField } from "./systems/GestureField";
import { STORY } from "@/lib/narrative";

function CinematicCamera() {
  const viewport = useThree((state) => state.viewport);
  const getThree = useThree((state) => state.get);
  const target = new THREE.Vector3();

  useFrame((_, delta) => {
    experienceStore.tick(delta);
    const camera = getThree().camera;
    const p = experienceStore.progress;
    const pointer = experienceStore.pointer;
    const portrait = viewport.aspect < 0.8;
    const final = smooth(p, STORY.return.in, STORY.final.focus);
    const touchWeight = pointer.coarse ? 1.45 : 1;
    const desiredX = pointer.x * (portrait ? 0.085 : 0.14) * touchWeight * (1 - final);
    const desiredY = pointer.y * 0.065 * touchWeight * (1 - final) + THREE.MathUtils.lerp(0, 0.12, final);
    const descent = smooth(p, STORY.everything.in, STORY.garden.focus);
    const ascent = smooth(p, STORY.letter.out, STORY.final.focus);
    const desiredZ = THREE.MathUtils.lerp(7, 6.18, descent) + ascent * 0.14;
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
    light.set("#050407").lerp(new THREE.Color("#110b14"), smooth(p, STORY.everything.in, STORY.future.focus));
    light.lerp(new THREE.Color("#060509"), smooth(p, STORY.letter.out, STORY.final.focus));
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
      <GestureField />
    </>
  );
}
