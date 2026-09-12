"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { World } from "./World";

export default function SceneCanvas() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const dpr = coarse ? (memory <= 4 ? 1 : 1.25) : Math.min(1.65, window.devicePixelRatio);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ fov: 42, near: 0.1, far: 80, position: [0, 0, 7] }}
        gl={{ antialias: dpr < 1.5, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor("#050407")}
      >
        <Suspense fallback={null}>
          <World />
        </Suspense>
      </Canvas>
    </div>
  );
}
