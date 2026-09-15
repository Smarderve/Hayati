"use client";

import { PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scenePosition } from "@/src/experience/filmStore";
import type { SceneConfig } from "@/src/scenes/sceneData";
import { Architecture, SkyDome } from "@/src/world/Architecture";
import { Atmosphere, Foliage, LivingWater, WaterfallSystem } from "@/src/world/LivingSystems";
import { StoryMotif } from "@/src/scenes/StoryMotif";

function archShapes() {
  const portal = new THREE.Shape();
  portal.moveTo(-2.05, -3.4); portal.lineTo(-2.05, .55);
  portal.bezierCurveTo(-2.05, 1.9, -.88, 2.95, 0, 3.3);
  portal.bezierCurveTo(.88, 2.95, 2.05, 1.9, 2.05, .55);
  portal.lineTo(2.05, -3.4); portal.closePath();
  const frame = new THREE.Shape();
  frame.moveTo(-2.62, -3.65); frame.lineTo(-2.62, .75);
  frame.bezierCurveTo(-2.62, 2.45, -1.12, 3.55, 0, 3.95);
  frame.bezierCurveTo(1.12, 3.55, 2.62, 2.45, 2.62, .75);
  frame.lineTo(2.62, -3.65); frame.lineTo(2.05, -3.65); frame.lineTo(2.05, .55);
  frame.bezierCurveTo(2.05, 1.9, .88, 2.95, 0, 3.3);
  frame.bezierCurveTo(-.88, 2.95, -2.05, 1.9, -2.05, .55);
  frame.lineTo(-2.05, -3.65); frame.closePath();
  return { portal, frame };
}

function PortalAura({ color }: { color: string }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => { if (material.current) material.current.opacity = .16 + Math.sin(state.clock.elapsedTime * 1.4) * .07; });
  return <mesh position={[0, .12, -.06]} scale={1.045}><shapeGeometry args={[archShapes().portal, 40]} /><meshBasicMaterial ref={material} color={color} transparent opacity={.18} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>;
}

function SpatialPortal({ current, destination }: { current: SceneConfig; destination: SceneConfig }) {
  const { portal, frame } = useMemo(archShapes, []);
  const frameGeometry = useMemo(() => new THREE.ExtrudeGeometry(frame, { depth: .45, bevelEnabled: true, bevelSegments: 3, bevelSize: .07, bevelThickness: .07 }), [frame]);
  return (
    <group position={[0, .25, -15]}>
      <mesh geometry={frameGeometry} position={[0, 0, .12]}><meshStandardMaterial color={current.stone} roughness={.72} metalness={.12} emissive={current.light} emissiveIntensity={.08} /></mesh>
      <mesh>
        <shapeGeometry args={[portal, 40]} />
        <meshBasicMaterial toneMapped={false} side={THREE.FrontSide}>
          <RenderTexture attach="map" frames={Infinity} renderPriority={1}>
            <color attach="background" args={[destination.sky]} />
            <PerspectiveCamera makeDefault manual aspect={.62} position={[0, .8, 12]} fov={48} />
            <EnvironmentBody config={destination} preview />
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
      <PortalAura color={destination.light} />
      <pointLight position={[0, .4, 1]} color={destination.light} intensity={7} distance={8} />
    </group>
  );
}

export function EnvironmentBody({ config, preview = false }: { config: SceneConfig; preview?: boolean }) {
  return (
    <>
      <SkyDome config={config} />
      <ambientLight color={config.horizon} intensity={.62} />
      <directionalLight position={[-6, 9, 7]} color="#d9e6f7" intensity={1.6} />
      <pointLight position={[4, 0, 4]} color={config.light} intensity={5 + config.warmth * 4} distance={16} />
      <Architecture config={config} preview={preview} />
      <LivingWater color={config.water} preview={preview} />
      <WaterfallSystem enabled={config.waterfall} />
      <Foliage />
      <Atmosphere config={config} preview={preview} />
      <StoryMotif config={config} preview={preview} />
    </>
  );
}

export function SceneEnvironment({ config, index, next }: { config: SceneConfig; index: number; next?: SceneConfig }) {
  return (
    <group position={[0, 0, scenePosition(index)]}>
      <EnvironmentBody config={config} />
      {next ? <SpatialPortal current={config} destination={next} /> : null}
    </group>
  );
}
