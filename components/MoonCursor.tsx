"use client";

import { useEffect, useRef } from "react";

export function MoonCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -100;
    let y = -100;
    let currentX = x;
    let currentY = y;
    let frame = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cursor.current?.classList.add("is-visible");
    };
    const tick = () => {
      currentX += (x - currentX) * 0.16;
      currentY += (y - currentY) * 0.16;
      if (cursor.current) cursor.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={cursor} className="moon-cursor" aria-hidden="true" />;
}
