"use client";

import { AdaptiveDpr, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { TravelWorld } from "@/src/scenes/TravelWorld";

export function CinematicCanvas() {
  return (
    <Canvas
      className="cinematic-canvas"
      dpr={[1, 1.6]}
      camera={{ fov: 47, near: 0.08, far: 120, position: [0, 1.2, 13] }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <TravelWorld />
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
