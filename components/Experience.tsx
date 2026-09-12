"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioDirector } from "@/lib/audio-director";
import { experienceStore } from "@/lib/experience-store";
import { StartGate } from "./StartGate";
import { AudioControl } from "./AudioControl";
import { MoonCursor } from "./MoonCursor";
import { MotionDirector } from "./MotionDirector";

const SceneCanvas = dynamic(() => import("./scene/SceneCanvas"), { ssr: false });

export function Experience() {
  const [started, setStarted] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<AudioDirector | null>(null);

  useEffect(() => {
    const director = new AudioDirector();
    audio.current = director;
    director.prepare().then(setAudioAvailable);
    document.body.style.overflow = "hidden";

    const update = () => experienceStore.updateProgress();
    const pointer = (event: PointerEvent) => experienceStore.updatePointer(event.clientX, event.clientY);
    const visibility = () => director.handleVisibility(document.hidden);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerdown", pointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    update();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("pointerdown", pointer);
      document.removeEventListener("visibilitychange", visibility);
      director.destroy();
    };
  }, []);

  const begin = useCallback(async () => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
    experienceStore.started = true;
    setStarted(true);
    const didPlay = await audio.current?.start();
    setPlaying(Boolean(didPlay));
    setAudioAvailable(audio.current?.availability === "ready");
  }, []);

  const toggleAudio = useCallback(async () => {
    const state = await audio.current?.toggle();
    setPlaying(Boolean(state));
  }, []);

  return (
    <main className={started ? "experience is-started" : "experience"}>
      <SceneCanvas />
      <div className="atmospheric-vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      <div className="final-heart-reflection" aria-hidden="true" />
      <MoonCursor />
      <StartGate started={started} onStart={begin} />
      {started && audioAvailable && <AudioControl playing={playing} onToggle={toggleAudio} />}
      <MotionDirector started={started} />

      <div className="narrative" aria-hidden={!started}>
        <section className="story-section opening-beat">
          <div className="story-copy align-lower-left narrow-copy">
            <p className="quiet-line">There are things I never want you to forget.</p>
          </div>
          <span className="scroll-whisper" aria-hidden="true">stay with me</span>
        </section>

        <section className="story-section moon-beat">
          <div className="story-copy align-bottom-left medium-copy">
            <p className="display-line">Some feelings begin quietly.</p>
            <p className="support-line">Then, one day, they are impossible not to know.</p>
          </div>
        </section>

        <section className="story-section years-beat">
          <div className="story-copy align-center-left narrow-copy">
            <p className="display-line large">Around four years ago,<br />I knew.</p>
            <p className="support-line">Time has never made me less certain.<br />Only more sure of choosing you.</p>
          </div>
        </section>

        <section className="story-section everything-beat">
          <div className="story-copy align-center-right medium-copy">
            <p className="quiet-line">If you ask what I love about you,<br />I never know where to begin.</p>
            <p className="display-line everything-word">Everything.</p>
          </div>
        </section>

        <section className="story-section garden-beat">
          <div className="story-copy align-top-left medium-copy">
            <p className="display-line">With you, even the quiet parts of life feel full.</p>
            <p className="support-line">You make tenderness feel like home.</p>
          </div>
        </section>

        <section className="story-section playful-beat">
          <div className="story-copy align-center-left narrow-copy">
            <p className="quiet-line">And I love that we can be soft—</p>
            <p className="display-line playful-line">and still a little silly.</p>
          </div>
          <div className="touch-orbit" aria-hidden="true"><i /><i /></div>
        </section>

        <section className="story-section future-beat">
          <svg className="future-thread" viewBox="0 0 400 180" aria-hidden="true">
            <path d="M12 154 C86 133 98 45 171 65 C231 82 243 145 302 116 C342 97 354 41 390 28" />
          </svg>
          <div className="story-copy align-top-right medium-copy">
            <p className="display-line">I don’t only love where we are.</p>
            <p className="support-line">I love the life I can see us walking into.</p>
          </div>
        </section>

        <section className="story-section future-details-beat">
          <div className="story-copy future-list align-center-left wide-copy">
            <p>Marriage, chosen with care.</p>
            <p>New places, side by side.</p>
            <p>A home with peace inside it.</p>
            <p>A family, and dreams we protect for each other.</p>
            <p>Years passing—and us still growing beside one another.</p>
          </div>
        </section>

        <section className="story-section letter-beat">
          <div className="story-copy letter-copy align-center-left medium-copy">
            <p>Sun’dus,</p>
            <p>I am grateful you are in my life.</p>
            <p>I want you to feel loved in the loud moments and the ordinary ones. Supported in what you dream of. Safe in what we build together.</p>
          </div>
        </section>

        <section className="story-section letter-beat letter-second">
          <div className="story-copy letter-copy align-center-right medium-copy">
            <p>I choose you now.</p>
            <p>And I want to keep choosing you through marriage, through a home, through every journey, and all the quiet years still waiting for us.</p>
          </div>
        </section>

        <section className="story-section return-beat">
          <div className="story-copy align-lower-left narrow-copy">
            <p className="quiet-line">Wherever life takes us,<br />I know what remains.</p>
          </div>
        </section>

        <section className="story-section final-beat">
          <div className="story-copy final-copy">
            <h1>I love you to the moon and back, Hayati.</h1>
            <p>Forever yours, Abdulrahim.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
