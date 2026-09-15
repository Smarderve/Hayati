"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { StoryFigures } from "@/src/characters/StoryFigures";
import { cameraZ, cinematicStore } from "@/src/experience/cinematicStore";
import { EnchantedArch } from "@/src/portals/EnchantedArch";
import { LivingBookPortal } from "@/src/portals/LivingBookPortal";
import { FarawayDetails } from "@/src/world/FarawayDetails";
import { LiveWaterfalls } from "@/src/world/LiveWaterfalls";
import { LivingAtmosphere } from "@/src/world/LivingAtmosphere";
import { LivingWater } from "@/src/world/LivingWater";
import { ScenicPlate } from "@/src/world/ScenicPlate";

function CameraJourney() {
  const getThree = useThree((state) => state.get);
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const { camera, viewport } = getThree();
    const previous = cinematicStore.progress;
    const smoothing = cinematicStore.reducedMotion ? 12 : 4.8;
    cinematicStore.progress = THREE.MathUtils.damp(previous, cinematicStore.target, smoothing, delta);
    cinematicStore.velocity = delta > 0 ? (cinematicStore.progress - previous) / delta : 0;

    const progress = cinematicStore.progress;
    const desiredZ = cameraZ(progress);
    const descent = THREE.MathUtils.smoothstep(progress, 0, 0.22);
    const farawayLift = Math.sin(THREE.MathUtils.clamp((progress - 0.48) / 0.36, 0, 1) * Math.PI) * 0.7;
    const desiredY = 1.65 - descent * 1.05 + farawayLift + cinematicStore.pointer.y * 0.09;
    const desiredX = Math.sin(progress * Math.PI * 3.2) * (viewport.aspect < 0.72 ? 0.18 : 0.55) + cinematicStore.pointer.x * 0.12;

    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 7, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 4, delta);
    target.current.set(desiredX * 0.22, desiredY - 0.3, camera.position.z - 8.5);
    camera.lookAt(target.current);
  });
  return null;
}

function WorldLight() {
  const moon = useRef<THREE.DirectionalLight>(null);
  const warm = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    if (moon.current) moon.current.intensity = 1.7 + pulse;
    if (warm.current) warm.current.intensity = 7 + pulse * 6;
  });
  return (
    <>
      <ambientLight color="#8ea8cb" intensity={0.58} />
      <directionalLight ref={moon} position={[-6, 9, 8]} color="#cdddf4" intensity={1.7} />
      <pointLight ref={warm} position={[4.5, -0.5, 5]} color="#e7ad5e" intensity={7} distance={14} decay={2} />
      <pointLight position={[-4.2, 0, -15]} color="#e3bd78" intensity={8} distance={16} decay={2} />
      <fogExp2 attach="fog" args={["#07101f", 0.009]} />
    </>
  );
}

function DepthArchitecture() {
  const columns = [
    [-7.3, -0.2, 4.4, 1.05], [7.3, -0.2, 3.4, 1.05],
    [-6.7, -0.4, -8.5, 0.78], [6.9, -0.3, -10.2, 0.82],
    [-7.1, -0.5, -16.6, 0.7], [7.2, -0.45, -18.3, 0.72],
    [-6.4, -0.55, -31.2, 0.62], [6.6, -0.55, -33.6, 0.62],
  ] as const;
  return (
    <group>
      {columns.map(([x, y, z, scale], index) => (
        <group key={index} position={[x, y, z]} scale={scale}>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.46, 0.58, 7.4, 18]} /><meshStandardMaterial color="#7d7b79" roughness={0.78} metalness={0.05} /></mesh>
          <mesh position={[0, 3.72, 0]}><cylinderGeometry args={[0.67, 0.52, 0.42, 18]} /><meshStandardMaterial color="#9c927f" roughness={0.75} /></mesh>
          <pointLight position={[x > 0 ? -0.7 : 0.7, 0.4, 0.5]} color="#e4a851" intensity={2.2} distance={5} />
        </group>
      ))}
    </group>
  );
}

export function TravelWorld() {
  const [asterra, diptych] = useTexture(["/art/asterra-faraway-master.webp", "/art/faraway-zahraan-diptych.png"]);
  useEffect(() => {
    [asterra, diptych].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    });
  }, [asterra, diptych]);

  return (
    <>
      <CameraJourney />
      <WorldLight />
      <ScenicPlate texture={asterra} position={[0, 0.28, 0]} light={0.83} />
      <ScenicPlate texture={diptych} rect={[0.012, 0.02, 0.476, 0.96]} position={[0, 0.2, -24]} light={0.82} />
      <ScenicPlate texture={diptych} rect={[0.512, 0.02, 0.476, 0.96]} position={[0, 0.25, -45]} light={0.88} />
      <LiveWaterfalls />
      <group position={[0, 0, -23.7]} scale={0.94}><LiveWaterfalls /></group>
      <group position={[0, 0, -44.6]} scale={0.9}><LiveWaterfalls /></group>
      <EnchantedArch destination={diptych} />
      <LivingBookPortal destination={diptych} />
      <FarawayDetails />
      <StoryFigures />
      <DepthArchitecture />
      <LivingWater />
      <LivingAtmosphere />
    </>
  );
}
