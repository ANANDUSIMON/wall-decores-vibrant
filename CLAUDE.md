# Wall Decores Vibrant — Project Workflow

Remotion project for Wall Decores Artisan Collectives, rendered remotely via GitHub Actions
(not locally — this machine is 4GB RAM / i3, too weak to render). Never run
`npx remotion render` directly on this machine.

## Production stack

Installed on top of base Remotion (`remotion`, `@remotion/cli`):

- **`@remotion/lottie`** — plays real After Effects exports (Bodymovin JSON) inside a scene.
  Asset slot: `public/lottie/`, component: `src/components/LottieAccent.tsx`.
- **`@remotion/skia`** — premium ink/paint/gradient rendering via Skia's canvas.
- **`@remotion/rive`** — 2D vector character/storytelling animation from `.riv` files.
- **`@remotion/three` + `three`** — true 3D scenes inside Remotion.
- **`gsap`** — general-purpose JS animation/timeline sequencing.

All four `@remotion/*` packages are pinned to the same version as `remotion` itself
(currently `4.0.542`) — Remotion packages must match versions exactly.

## Composition layout

- `src/Film.tsx` — the 7 scenes (`S1`..`S7`), each exported, plus the combined `Film`
  composition that sequences them with crossfades.
- `src/Root.tsx` — registers `Film` (the full combined film) **and** `S1`..`S7` as
  independent `<Composition>`s, so each scene can render standalone.
- `src/components/LottieAccent.tsx` — drop-in Lottie component: loads a JSON from
  `public/lottie/` via `staticFile()`, gates render with `delayRender`/`continueRender`,
  and can recolor the Lottie's solid fills onto a `Palette` from `theme.ts`.

## Render pattern: 7-scene parallel matrix

`.github/workflows/render.yml`:

- One job per scene (`S1`..`S7`) in a matrix, all running in parallel on `ubuntu-latest`.
- Each renders `--codec h264 --crf 17 --x264-preset veryfast --pixel-format yuv420p --muted`
  and uploads as artifact `scene-<id>`.
- A final `concat` job downloads all `scene-*` artifacts, joins them **in S1→S7 order**
  with `ffmpeg -f concat -safe 0 -i list.txt -c copy` (lossless, no re-encode), ffprobes
  the result, and uploads it as artifact `final-video`
  (`out/wall-decores-vibrant-final.mp4`).
- Triggered with `workflow_dispatch` only.

## Workflow for a render

1. Edit scenes in `src/Film.tsx` (and shared components under `src/components/`).
2. Keep `src/Root.tsx`'s composition list in sync if scenes are added/removed.
3. Commit and push to `main`.
4. `gh workflow run render.yml`
5. `gh run watch` until it finishes.
6. `gh run download --name final-video` into `out/`.
