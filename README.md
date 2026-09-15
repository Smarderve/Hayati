# Hayati

The cinematic web companion to **Hayati — A Fairytale of the Two Kingdoms**. Scrolling drives one continuous Arabian fantasy film through the novel's 20 chronological story beats.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

The scripts use Webpack because the current Windows host loads Next's WebAssembly compiler; Vercel can run the same production build without configuration changes.

The ebook download is served locally from `public/books/hayati-a-fairytale-of-the-two-kingdoms.pdf`.

## Commands

```bash
npm run lint
npm run build
npm run start
```

## Project structure

- `app/` — App Router entry, metadata, visual tokens, and global error fallback.
- `src/experience/` — master progress, camera shell, and 20-beat timeline.
- `src/scenes/` — scene orchestration.
- `src/world/` — live water, waterfalls, atmosphere, and scenery.
- `src/portals/` — reusable portal transition engine.
- `src/characters/` — distant consistent character silhouettes.
- `docs/CINEMATIC_DIRECTION.md` — art direction and architecture.
- `ASSETS.md` — third-party provenance and licensing record.

## Privacy

There is no analytics or tracking. The website follows the supplied novel and approved artwork; it does not expose private dialogue.

## Release status

The project is production-build ready, but this revision is intentionally local-only. Do not push or deploy until Abdulrahim has reviewed and explicitly approved the finished experience.
