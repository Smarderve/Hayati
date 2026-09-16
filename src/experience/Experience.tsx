"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { FilmWorld } from "@/src/experience/FilmWorld";
import { filmStore, range } from "@/src/experience/filmStore";
import { DownloadBookButton } from "@/src/ui/DownloadBookButton";

function Wordmark({ finale = false }: { finale?: boolean }) {
  return <section className={finale ? "title-card finale" : "title-card opening"} aria-label="Hayati, A Fairytale of the Two Kingdoms"><Image className="hayati-wordmark" src="/brand/hayati-wordmark.webp" alt="Hayati" width={842} height={371} loading="eager" /><p>A Fairytale of the Two Kingdoms</p><DownloadBookButton /></section>;
}

export function Experience() {
  const opening = useRef<HTMLDivElement>(null);
  const finale = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    filmStore.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; filmStore.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0; };
    const pointer = (event: PointerEvent) => { filmStore.pointer.x = event.clientX / window.innerWidth * 2 - 1; filmStore.pointer.y = -(event.clientY / window.innerHeight * 2 - 1); };
    let active = true;
    const paint = () => {
      if (!active) return;
      const progress = filmStore.progress;
      const intro = 1 - range(progress, .055, .085);
      const ending = range(progress, .965, .992);
      const transitionCover = Math.min(.72, Math.abs(filmStore.velocity) * 9);
      if (opening.current) { opening.current.style.opacity = String(intro); opening.current.style.pointerEvents = intro > .55 ? "auto" : "none"; }
      if (finale.current) { finale.current.style.opacity = String(ending); finale.current.style.pointerEvents = ending > .55 ? "auto" : "none"; }
      if (fallback.current) fallback.current.style.opacity = String(transitionCover);
      requestAnimationFrame(paint);
    };
    update(); requestAnimationFrame(paint);
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); window.addEventListener("pointermove", pointer, { passive: true });
    return () => { active = false; window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.removeEventListener("pointermove", pointer); };
  }, []);
  return <main className="experience"><div ref={fallback} className="experience-fallback" aria-hidden="true" /><FilmWorld /><div className="film-grain" aria-hidden="true" /><div className="cinema-vignette" aria-hidden="true" /><div ref={opening}><Wordmark /></div><div ref={finale}><Wordmark finale /></div><div className="scroll-track" aria-hidden="true" /></main>;
}
