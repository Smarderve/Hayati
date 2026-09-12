"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import anime from "animejs";

export function MotionDirector({ started }: { started: boolean }) {
  useEffect(() => {
    if (!started) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
    });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-copy").forEach((element) => {
        const holds = element.classList.contains("final-copy");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: element.closest(".story-section"),
              start: "top 76%",
              end: holds ? "top 24%" : "bottom 28%",
              scrub: 0.65,
            },
          })
          .fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: holds ? 1 : 0.44, ease: "power2.out" },
          )
          .to(
            element,
            { autoAlpha: holds ? 1 : 0, y: holds ? 0 : -18, duration: holds ? 0.01 : 0.28 },
            holds ? "+=4" : "+=0.32",
          );
      });

      const path = document.querySelector<SVGPathElement>(".future-thread path");
      if (path) {
        const offset = anime.setDashoffset(path);
        path.style.strokeDasharray = `${offset}`;
        path.style.strokeDashoffset = `${offset}`;
        ScrollTrigger.create({
          trigger: ".future-thread",
          start: "top 78%",
          once: true,
          onEnter: () => {
            anime({
              targets: path,
              strokeDashoffset: [offset, 0],
              duration: 2600,
              easing: "easeInOutSine",
            });
          },
        });
      }

      gsap.to(".final-heart-reflection", {
        opacity: 0.085,
        scrollTrigger: {
          trigger: ".final-beat",
          start: "top 72%",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      context.revert();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [started]);

  return null;
}
