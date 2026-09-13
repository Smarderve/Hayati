# Hayati

A private, cinematic love experience from Abdulrahim to Sun'dus (“Hayati”). It is a single continuous page built around a realistic NASA-textured moon, with a scroll-led journey from orbit into a symbolic night garden and back again.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

The scripts use Webpack because the current Windows host loads Next's WebAssembly compiler; Vercel can run the same production build without configuration changes.

## Licensed music

The intended track is **“Love” by Kouz1**. Copyrighted audio is deliberately not included.

Place a legally obtained file at:

```text
public/audio/love-kouz1.licensed.mp3
```

The `AudioDirector` checks for the track, handles browser permission and visibility changes, fades playback, and leaves the visual sequence fully functional when audio is absent, delayed, blocked, or paused.

## Commands

```bash
npm run lint
npm run build
npm run start
```

## Project structure

- `app/` — App Router entry, metadata, visual tokens, and global error fallback.
- `components/Experience.tsx` — narrative content and experience state.
- `components/scene/` — independent R3F moon, star, cloud, garden, future, camera, and lighting systems.
- `lib/audio-director.ts` — resilient audio abstraction.
- `docs/ART_DIRECTION.md` — storyboard, token system, research decisions, and performance budget.
- `docs/QA.md` — verified viewport/build results.
- `ASSETS.md` — third-party provenance and licensing record.

## Privacy

There is no authentication because the final URL is intended to be shared privately. There is also no analytics, tracking, personal photography, generated portraiture, or invented relationship history.

## Release status

The project is production-build ready, but this revision is intentionally local-only. Do not push or deploy until Abdulrahim has reviewed and explicitly approved the finished experience.
