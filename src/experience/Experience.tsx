"use client";

import { useEffect, useRef } from "react";
import { CinematicCanvas } from "@/src/experience/CinematicCanvas";
import { cinematicStore, windowed } from "@/src/experience/cinematicStore";
import { DownloadBookButton } from "@/src/ui/DownloadBookButton";

export function Experience() {
  const title = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cinematicStore.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      cinematicStore.target = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    };
    const updatePointer = (event: PointerEvent) => {
      cinematicStore.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      cinematicStore.pointer.y = (event.clientY / window.innerHeight - 0.5) * -2;
    };
    let active = true;
    const paintInterface = () => {
      if (!active) return;
      const progress = cinematicStore.progress;
      const reveal = windowed(progress, 0.025, 0.075) * (1 - windowed(progress, 0.2, 0.31));
      if (title.current) {
        title.current.style.opacity = String(reveal);
        title.current.style.transform = `translate3d(0, ${progress * -54}px, 0)`;
        title.current.style.pointerEvents = reveal > 0.5 ? "auto" : "none";
      }
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${progress})`;
      requestAnimationFrame(paintInterface);
    };

    updateScroll();
    const frame = requestAnimationFrame(paintInterface);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return (
    <main className="experience">
      <div className="poster-fallback" aria-hidden="true" />
      <CinematicCanvas />
      <div className="film-grain" aria-hidden="true" />
      <div className="cinema-vignette" aria-hidden="true" />
      <section ref={title} className="opening-title" aria-label="Hayati, A Fairytale of the Two Kingdoms">
        <span className="opening-kicker">A cinematic fairytale</span>
        <h1>Hayati</h1>
        <p>A Fairytale of the Two Kingdoms</p>
        <DownloadBookButton />
        <span className="scroll-cue" aria-hidden="true"><i />Scroll to travel</span>
      </section>
      <div className="journey-progress" aria-hidden="true"><div ref={progressLine} /></div>
      <div className="scroll-track" aria-hidden="true" />
    </main>
  );
}
