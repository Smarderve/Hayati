"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SceneManager } from "@/src/scenes/SceneManager";
export default function CinematicCanvas() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const dpr = coarse ? (memory <= 4 ? 1 : 1.25) : Math.min(1.6, devicePixelRatio);
  return <div className="cinematic-canvas"><Canvas dpr={dpr} camera={{ fov: 40, near: .1, far: 80, position: [0, 0, 8] }} gl={{ antialias: dpr < 1.5, powerPreference: "high-performance" }}><Suspense fallback={null}><SceneManager /></Suspense></Canvas></div>;
}
