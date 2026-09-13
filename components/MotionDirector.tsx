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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".story-copy", { autoAlpha: 1, y: 0 });
      gsap.set(".future-list p", { opacity: 1, x: 0 });
      return () => { gsap.set(".story-copy, .future-list p", { clearProps: "all" }); };
    }

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

      gsap.fromTo(
        ".everything-word span",
        { letterSpacing: "-0.09em", filter: "blur(7px)", scale: 0.94 },
        {
          letterSpacing: "-0.055em",
          filter: "blur(0px)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".everything-beat", start: "top 68%", end: "center 44%", scrub: 0.9 },
        },
      );

      gsap.fromTo(
        ".year-orbits i",
        { opacity: 0, scale: 0.72, rotate: -12 },
        {
          opacity: (index) => 0.2 - index * 0.03,
          scale: 1,
          rotate: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: ".years-beat", start: "top 70%", end: "center 45%", scrub: 1 },
        },
      );

      gsap.utils.toArray<HTMLElement>(".future-moment").forEach((moment, index) => {
        const line = moment.querySelector("p");
        if (!line) return;
        gsap.timeline({ scrollTrigger: { trigger: moment, start: "top 82%", end: "bottom 18%", scrub: 0.8 } })
          .fromTo(line, { opacity: 0, x: index % 2 ? 26 : -26, y: 18 }, { opacity: 1, x: 0, y: 0, duration: 0.42, ease: "power2.out" })
          .to(line, { opacity: 0, y: -18, duration: 0.3 }, "+=0.28");
      });

      gsap.to(".letter-veil", {
        opacity: 1,
        scrollTrigger: { trigger: ".letter-beat", start: "top 72%", endTrigger: ".letter-second", end: "bottom 32%", scrub: 1.2 },
      });

      gsap.to(".letter-veil", {
        opacity: 0,
        scrollTrigger: { trigger: ".return-beat", start: "top 72%", end: "center 45%", scrub: 1.1 },
      });

      gsap.fromTo(
        ".hidden-hayati",
        { opacity: 0 },
        { opacity: 0.105, scrollTrigger: { trigger: ".garden-beat", start: "top 60%", end: "bottom 38%", scrub: 1.3 } },
      );

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
