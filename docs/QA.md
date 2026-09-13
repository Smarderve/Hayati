# Production QA

## Automated verification

- `npm run lint` — passes with no errors or warnings.
- `npm run build` — passes under Next.js 16.3.5 with TypeScript and static generation.
- `/` prerenders as static content.
- Fresh production browser console — no warnings or errors.
- Audio request failure — non-breaking by design; controls remain absent when the licensed track is not supplied.

## Revision visual verification

Verified against the production server, not the development bundle, after the interaction and future-scene rebuild:

- 390 × 844 portrait — interaction gate, opening, individual future beats, quiet letter, and final idle frame.
- 1440 × 900 desktop — “Everything.” reveal, playful garden, shelter/future landscape, and asymmetrical lunar composition.
- Fresh production browser console — no warnings or errors across the full journey.

The earlier 360 × 780 and 412 × 915 checks remain representative of the same portrait composition logic and fluid type clamps. Landscape receives an explicit short-viewport treatment.

## Issues found and resolved

1. The italic “Everything.” overhung the right edge at 390 px. Its mobile optical size was reduced and its copy measure widened.
2. Three.js r183+ deprecated `Clock`, which React Three Fiber 9 still uses internally. Three.js is pinned to r182, the newest pre-deprecation release, eliminating console warnings without suppressing them.
3. The host's port 3000 belonged to an unrelated local project. Production QA was repeated on isolated port 3100.
4. A partially interrupted dependency install produced missing transitive modules. A clean lockfile install repaired the tree before final verification.
5. Future promises accumulated on screen and collided with the letter in an intermediate revision. The list was rebuilt as five independent 92dvh moments with paired GSAP entrances/exits.
6. The desktop “Everything.” word initially overhung its measure. Its maximum optical size and copy width were recalibrated while preserving the intentionally dominant scale.
7. Ambient blooms looked too saturated during the anti-slop pass. Ordinary flowers were reduced and muted; brighter color is now reserved for the discovered hold-to-bloom flower.

## Manual acceptance notes

- The start gate works through keyboard/semantic button activation and touch.
- Vertical scrolling remains browser-native on touch; Lenis only smooths wheel input.
- All critical narrative copy is understandable without discovering the pointer/touch easter eggs.
- Pointer/touch handlers remain passive and never suppress native vertical scrolling; hold detection cancels naturally after movement.
- `prefers-reduced-motion` removes smooth-scroll interpolation, stabilizes copy, and disables decorative CSS loops.
- The WebGL frameloop stops while the document is hidden.
- The moon texture is under 500 KB; mobile DPR is clamped; repeated garden geometry is instanced; no post-processing pass is used.
- The final exact wording is present and holds in an indefinite, minimally animated state; the moon rotation settles to a near-still drift.
- No licensed music file is bundled, so final music pacing should receive one last human listening pass after Abdulrahim supplies the track.
