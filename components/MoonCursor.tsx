"use client";

import { useEffect, useRef } from "react";

export function MoonCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -100;
    let y = -100;
    let currentX = x;
    let currentY = y;
    let frame = 0;
    const trailX = [-100, -100, -100];
    const trailY = [-100, -100, -100];
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cursor.current?.classList.add("is-visible");
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]");
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
        if (element !== target) element.style.removeProperty("--magnetic-x");
        if (element !== target) element.style.removeProperty("--magnetic-y");
      });
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--magnetic-x", `${(event.clientX - rect.left - rect.width / 2) * 0.13}px`);
        target.style.setProperty("--magnetic-y", `${(event.clientY - rect.top - rect.height / 2) * 0.13}px`);
      }
    };
    const tick = () => {
      currentX += (x - currentX) * 0.16;
      currentY += (y - currentY) * 0.16;
      if (cursor.current) cursor.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      trailX[0] += (currentX - trailX[0]) * 0.2;
      trailY[0] += (currentY - trailY[0]) * 0.2;
      for (let index = 1; index < trail.current.length; index += 1) {
        trailX[index] += (trailX[index - 1] - trailX[index]) * (0.18 - index * 0.025);
        trailY[index] += (trailY[index - 1] - trailY[index]) * (0.18 - index * 0.025);
      }
      trail.current.forEach((dot, index) => {
        dot.style.transform = `translate3d(${trailX[index]}px, ${trailY[index]}px, 0) scale(${1 - index * 0.22})`;
      });
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cursor-field" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span key={index} ref={(node) => { if (node) trail.current[index] = node; }} className="cursor-trail" />
      ))}
      <div ref={cursor} className="moon-cursor" />
    </div>
  );
}
