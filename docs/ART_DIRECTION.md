# Hayati — art direction and implementation plan

## Subject, audience, and job

This is a private, single-page love experience from Abdulrahim to Sun'dus (“Hayati”). Its only job is to make one person feel seen, chosen, safe, and excited about a shared future.

## Concept: the moon remembers

The moon is the one visual constant. Its distance, crop, warmth, and surface detail change while the story moves from uncertainty into quiet certainty. The page descends from orbit through clouds into a night garden, travels through one symbolic future landscape, then rises to the same moon for the final line.

The signature moment is deliberate stillness: after an experience full of spatial motion, the final moon stops travelling and the final sentence appears without typewriting, word animation, or spectacle.

## Visual tokens

### Color

- `ink` — `#050407`: the opening darkness.
- `charcoal` — `#0d0a11`: readable shadow detail.
- `aubergine` — `#17101d`: atmospheric depth.
- `plum` — `#39263f`: restrained floral and cloud warmth.
- `moon` — `#d8d8de`: cool lunar light.
- `ivory` — `#f0e9dc`: emotional warmth near the future and ending.
- `ember` — `#b98f83`: rare living/warm accent.

### Type

- Display: Bodoni Moda, used only for emotional sentences and the final line.
- Body/utility: Manrope, used for restrained supporting copy and controls.
- No handwriting face. Intimacy comes from scale, line breaks, and timing.

### Layout

Portrait-first. Copy occupies negative space created by an off-axis moon rather than sitting in centered containers. Scene heights vary with emotional weight; there are no visible chapters.

```text
mobile opening                 mobile revelation
┌──────────────────┐           ┌──────────────────┐
│       · moon     │           │      ◜██████████ │
│                  │           │     ████████████ │
│                  │           │                  │
│  Hayati.         │           │  Four years ago,│
│  touch to begin  │           │  I knew.         │
└──────────────────┘           └──────────────────┘

desktop garden                final stillness
┌──────────────────────────┐   ┌──────────────────┐
│ copy            moon ◯   │   │   ◜██████████◝   │
│        cloud            │   │                  │
│ ─ grasses / flowers ─   │   │ I love you…     │
└──────────────────────────┘   └──────────────────┘
```

### Motion rhythm

- Intimate reveal: 650–900 ms, `cubic-bezier(.22,1,.36,1)`.
- Spatial transition: 1.4–2.4 s equivalent scroll travel.
- Ambient movement: 12–40 s loops.
- Final hold: effectively indefinite.
- Scroll remains native-feeling; Lenis only softens interpolation and never controls destination.

## Narrative ranges

All rendering derives from normalized page progress (`0 → 1`):

- `0.00–0.10` — darkness and small moon.
- `0.10–0.24` — enormous lunar reveal.
- `0.24–0.36` — four-year certainty.
- `0.36–0.48` — “everything”; descent through cloud.
- `0.48–0.62` — night garden and playful paired lights.
- `0.62–0.78` — the future as one transforming landscape.
- `0.78–0.89` — quiet letter.
- `0.89–1.00` — return to the moon and indefinite final state.

## Architecture

- `Experience`: DOM narrative, interaction gate, and global progress.
- `SceneCanvas`: dynamically loaded R3F canvas and quality governor.
- `MoonSystem`, `StarField`, `CloudSystem`, `GardenEnvironment`, `FutureEnvironment`: independent render systems.
- `CinematicCamera` and `LightingRig`: responsive framing derived from progress.
- `MotionDirector`: GSAP/ScrollTrigger for major DOM choreography and Lenis integration.
- `AudioDirector`: permission, local licensed asset detection, playback, fades, visibility, and non-blocking cue fallback.
- CSS/React Motion: micro-interactions only.
- Anime.js: one self-authored SVG thread/path reveal in the future sequence.

## Performance budget

- Initial lunar texture: 2K JPEG, under 500 KB.
- WebGL DPR: 1–1.35 on touch/coarse-pointer devices, maximum 1.75 on desktop.
- Stars: 420 mobile / 760 desktop points.
- Garden repeated geometry: instanced; no per-frame React state.
- No post-processing pipeline; glow is material/color/atmosphere, not full-screen bloom.
- Heavy canvas is client-only and dynamically imported.
- Rendering pauses when the document is hidden.
- Target compressed first-load JS under approximately 450 KB where practical for the chosen stack.

## UI/component research shortlist

Twenty current sources were reviewed as an interaction research pool: Aceternity UI, React Bits, Magic UI, Motion Primitives, Animate UI, Cult UI, Kokonut UI, Hover.dev, shadcn/ui, Kibo UI, Eldora UI, 21st.dev, HeroUI, Park UI, Ark UI, Base UI, Radix UI, Float UI, HyperUI, and Uiverse.

Useful principles retained:

- Motion Primitives / Animate UI: preserve spatial continuity and spring restraint.
- React Bits / Hover.dev: pointer response can be atmospheric rather than button-like.
- Radix / Base UI / Ark UI: tiny controls still need real semantics and focus behavior.
- Aceternity / Magic UI: mask reveals and light-following interactions are useful only when stripped of their default glow-heavy styling.

No source component is copied or installed. This avoids recognizable library styling and licensing ambiguity. The implementation uses only project-authored components built on the core animation/rendering packages.

## Self-critique before build

An early concept used a distinct tableau for marriage, travel, home, and family. That risked becoming a disguised card carousel. It was replaced with one evolving landscape so each future wish feels causally connected. The garden is also kept mostly in silhouette; saturated purple flowers and constant petals would drift into generic fantasy/Valentine aesthetics.

