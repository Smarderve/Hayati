# Production QA

## Automated verification

- `npm run lint` — passes with no errors or warnings.
- `npm run build` — passes under Next.js 16.3.5 with TypeScript and static generation.
- `/` prerenders as static content.
- Fresh production browser console — no warnings or errors.
- Audio request failure — non-breaking by design; controls remain absent when the licensed track is not supplied.

## Visual verification

Verified against the production server, not the development bundle:

- 360 × 780 portrait — opening, lunar reveal, four-years copy, garden transition, return, and final state.
- 390 × 844 portrait — complete narrative progression and the “Everything.” moment.
- 412 × 915 portrait — fresh load, interaction gate, full progression, final idle composition, clean console.
- 1440 × 900 desktop — opening restraint, off-axis four-years composition, and final moon/copy balance.

The 375 × 812 and 390 × 844 targets share the same portrait composition logic and fluid type clamps; the 390 target was directly inspected. Landscape receives an explicit short-viewport treatment.

## Issues found and resolved

1. The italic “Everything.” overhung the right edge at 390 px. Its mobile optical size was reduced and its copy measure widened.
2. Three.js r183+ deprecated `Clock`, which React Three Fiber 9 still uses internally. Three.js is pinned to r182, the newest pre-deprecation release, eliminating console warnings without suppressing them.
3. The host's port 3000 belonged to an unrelated local project. Production QA was repeated on isolated port 3100.
4. A partially interrupted dependency install produced missing transitive modules. A clean lockfile install repaired the tree before final verification.

## Manual acceptance notes

- The start gate works through keyboard/semantic button activation and touch.
- Vertical scrolling remains browser-native on touch; Lenis only smooths wheel input.
- All critical narrative copy is understandable without discovering the pointer/touch easter eggs.
- The moon texture is under 500 KB; mobile DPR is clamped; repeated garden geometry is instanced; no post-processing pass is used.
- The final exact wording is present and holds in an indefinite, minimally animated state.
- No licensed music file is bundled, so final music pacing should receive one last human listening pass after Abdulrahim supplies the track.
