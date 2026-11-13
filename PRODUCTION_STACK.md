# Production Stack — plain-language guide

This project can now use four extra kinds of animation on top of plain Remotion code:

- **Lottie** — a real animation exported from Adobe After Effects (via the free "Bodymovin"
  plugin) as a small JSON file. Good for sparkles, icon animations, hand-drawn flourishes.
- **Skia** — a rendering engine for premium ink/paint/gradient effects (the same engine
  Chrome and Android use for 2D graphics).
- **Rive** — small, interactive 2D vector animations, good for characters or storytelling
  mascots, exported from the free Rive editor as a `.riv` file.
- **Three.js** — real 3D graphics (rotating objects, 3D text, lit scenes) inside the video.

## Where to get free assets

- **Lottie animations** — [lottiefiles.com](https://lottiefiles.com). Search, preview, then
  download the "Lottie JSON" file. Drop it into `public/lottie/`.
- **Rive files** — [rive.app/community](https://rive.app/community). Browse community
  files, download the `.riv` file.
- **Free 3D models/HDRIs** — [polyhaven.com](https://polyhaven.com). Free textures, HDRIs,
  and 3D models (CC0, no attribution required) for use with `@remotion/three`.

## How to ask Claude Code to use one in a scene

Just describe what you want and point at the file, e.g.:

> "Download a sparkle animation from LottieFiles, put it in `public/lottie/sparkle.json`,
> and add it as an accent in the top-right corner of S1 using `LottieAccent`, recolored
> to the `coralJade` palette."

> "I downloaded `mascot.riv` from Rive community into `public/rive/` — add it waving in
> the corner of S7 using `@remotion/rive`."

> "Add a free HDRI from Polyhaven and render the S5 painting grid as a 3D wall using
> `@remotion/three`."

Claude Code will wire the component in, keep it rendering on GitHub Actions (never locally
on this machine), and keep `CLAUDE.md` in sync with any new scenes or compositions.
