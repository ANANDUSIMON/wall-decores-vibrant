# Wall Decores — Vibrant Interior Film

35s · 1080×1920 (9:16) · 30fps · silent

Built on `peaceful_vibrant_painting_palettes.json`. Every ground is a palette
from that spec; your room renders carry the interior scenes.

## Render

```bash
npm install
npm run render -- --browser-executable=$(which google-chrome || which chromium)
npm run studio   # live preview
```

Output: `out/vibrant.mp4`.

## Why there is no black

The spec's own area ratio decides it:

| group | share | where it goes here |
|---|---|---|
| soft atmosphere | 45–55% | the ground field of every graphic scene |
| cool structural | 25–30% | the second wash, panels, arcs |
| warm expressive accent | 10–15% | chips, rules, seams, focal strokes |
| highlight + deep value | 5–10% | cream rest zones + the ink used for type |

Deep value is a *small* share — so the darks here are warm inks (`#43251F`,
`#17403C`), never neutral black. A black ground would spend the whole
atmosphere budget on absence.

## Scenes

| # | Frames | Scene | Palette / source |
|---|---|---|---|
| 1 | 0–150 | Open — painting arrives as paint | P12 Coral & Jade |
| 2 | 144–324 | **The Choice** — same wall, art wiped A/B | `r2_sofa_b` → `r2_sofa_a` |
| 3 | 318–468 | The palette, made visible | P04 ground + P12 chips |
| 4 | 462–642 | Pooja wall, slow push | `r4_pooja_a` |
| 5 | 636–786 | The collections, salon grid | P06 Golden Turquoise |
| 6 | 780–930 | Entrance, art on the far wall | `r1_entrance_a` |
| 7 | 924–1050 | Lockup | P12 Coral & Jade |

### Scene 2 is the argument

Your eight room shots are four rooms photographed twice — same camera, two
different paintings. Scene 2 wipes one over the other: the wall, sofa and
light stay identical and only the art changes. That is the sales case made
visually, and it cost nothing because the shots already existed.

To use it on another room, pass both versions:

```tsx
<Room src="r4_pooja_b" srcB="r4_pooja_a" reveal={reveal} ... />
```

## Swapping palettes

`src/theme.ts` holds five vibrant palettes from the JSON (`PAL.coralJade`,
`lotusLagoon`, `goldenTurquoise`, `peacockDawn`, `springHibiscus`). Change the
`const p = PAL.x` line at the top of any scene and the whole ground, arcs and
sweep retune together.

Adding one of the spec's other palettes is five hex values in the same shape.

## Framing a landscape room in a tall frame

Rooms are 1536×1024. Scaled to fill 1920 tall they run 2880 wide, leaving
1800px of pan latitude — so the camera moves *inside* the room instead of
letterboxing it. `focusFrom`/`focusTo` are 0 (far left wall) to 1 (far right).

Check where the art actually is before choosing them. The entrance room has
art only on its far walls, and an early version panned straight through the
centre — which is window and curtain — and showed no paintings at all.

## Adding audio

Rendered silent so it drops cleanly into any editor. Over the top:

```bash
ffmpeg -i out/vibrant.mp4 -i music.mp3 \
  -map 0:v -map 1:a -c:v copy -shortest final.mp4
```

`-c:v copy` means the picture is never re-encoded.

## Other aspect ratios

Change `width`/`height` in `src/Root.tsx` (1920×1080, 1080×1080). Scenes are
centre-composed and mostly re-fit; room `focus` values and a few `Block`
offsets want a look. Same pattern as your gallery-film repo, so it drops into
the GitHub Actions matrix.

## Structure

- `src/Film.tsx` — the seven scenes and the timeline
- `src/theme.ts` — palettes, ratios, inks, geometry constants
- `src/components/Ground.tsx` — the living vibrant ground, petal arcs, washes
- `src/components/Room.tsx` — 9:16 framing of landscape rooms + the A/B wipe
- `src/components/Art.tsx` — canvas with dual tinted shadow + paint-on reveal
- `src/components/Type.tsx` — rise type, kicker, palette swatch
