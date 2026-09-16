"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { FILM_LENGTH, filmStore, sceneFloat, sceneIndex, sceneLocal, scenePosition } from "@/src/experience/filmStore";
import { SceneEnvironment } from "@/src/scenes/SceneEnvironment";
import { scenes } from "@/src/scenes/sceneData";

function CameraDirector({ onScene }: { onScene: (index: number) => void }) {
  const getThree = useThree((state) => state.get);
  const target = useRef(new THREE.Vector3());
  const previousIndex = useRef(0);
  useFrame((_, delta) => {
    const { camera, viewport } = getThree();
    const before = filmStore.progress;
    filmStore.progress = THREE.MathUtils.damp(before, filmStore.target, filmStore.reducedMotion ? 11 : 4.5, delta);
    filmStore.velocity = delta ? (filmStore.progress - before) / delta : 0;
    const floating = sceneFloat(filmStore.progress);
    const index = sceneIndex(filmStore.progress);
    const local = sceneLocal(filmStore.progress);
    if (index !== previousIndex.current) { previousIndex.current = index; filmStore.activeScene = index; onScene(index); }
    const baseZ = 12 - floating * 34;
    const lateral = Math.sin(floating * Math.PI * 1.35) * (viewport.aspect < .72 ? .18 : .62);
    const rise = .65 + Math.sin(local * Math.PI) * .7;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ, 7, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, lateral + filmStore.pointer.x * .1, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, rise + filmStore.pointer.y * .07, 4, delta);
    target.current.set(lateral * .18, .15, camera.position.z - 8.5);
    camera.lookAt(target.current);
  });
  return null;
}

function ActiveScenes() {
  const [active, setActive] = useState(0);
  const indices = [active - 1, active, active + 1].filter((index) => index >= 0 && index < FILM_LENGTH);
  return <><CameraDirector onScene={setActive} />{indices.map((index) => <SceneEnvironment key={index} index={index} config={scenes[index]} next={index === active ? scenes[index + 1] : undefined} />)}</>;
}

function LoadingEnvironment() {
  return (
    <mesh position={[0, 0, -8]} scale={[18, 10, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#0b1830" transparent opacity={.1} depthWrite={false} />
    </mesh>
  );
}

export function FilmWorld() {
  return (
    <Canvas className="cinematic-canvas" dpr={[1, 1.5]} camera={{ fov: 48, near: .08, far: 90, position: [0, .7, scenePosition(0) + 12] }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => gl.setClearColor("#07142b", 0)}>
      <fogExp2 attach="fog" args={[scenes[0].sky, .012]} />
      <Suspense fallback={<LoadingEnvironment />}><ActiveScenes /></Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
