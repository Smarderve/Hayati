"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { cinematicStore } from "./store";
import { beatAt } from "./StoryTimeline";
import { TitleCard } from "@/src/ui/TitleCard";

const CinematicCanvas = dynamic(() => import("./CinematicCanvas"), { ssr: false });

export function Experience() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cinematicStore.updateProgress();
        const p = cinematicStore.progress;
        if (root.current) {
          root.current.style.setProperty("--opening", String(Math.max(0, 1 - p / .055)));
          root.current.style.setProperty("--finale", String(Math.max(0, Math.min(1, (p - .94) / .045))));
          root.current.dataset.beat = beatAt(p).id;
        }
      });
    };
    const pointer = (event: PointerEvent) => cinematicStore.updatePointer(event.clientX, event.clientY);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    addEventListener("pointermove", pointer, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); removeEventListener("pointermove", pointer); };
  }, []);
  return <main ref={root} className="cinematic-experience">
    <CinematicCanvas />
    <div className="cinematic-grade" aria-hidden="true" />
    <TitleCard />
    <div className="scroll-sigil" aria-hidden="true"><i />scroll to enter</div>
    <TitleCard finale />
    <div className="scroll-track" aria-hidden="true" />
  </main>;
}
