/**
 * Colour system derived from peaceful_vibrant_painting_palettes.json.
 *
 * The JSON's global area ratio is the law of this film:
 *   soft atmosphere       45–55%   -> the GROUND of every scene
 *   cool structural       25–30%   -> panels, arcs, type blocks
 *   warm expressive accent 10–15%  -> chips, rules, focal strokes
 *   highlight + deep value  5–10%  -> cream breathing space + ink text
 *
 * That is why nothing here is black: the deep value is a *small* share and it
 * is a warm ink, not a void. A black ground would blow the 45–55% atmosphere
 * budget on absence.
 */

export const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
export const SANS = "'Inter', 'Inter Display', 'Helvetica Neue', Arial, sans-serif";

export type Palette = {
  id: string;
  name: string;
  dominant: string;
  coDominant: string;
  supporting: string;
  secondary: string;
  highlight: string;
};

/** The vibrant subset of the spec — the ones with real chroma. */
export const PAL: Record<string, Palette> = {
  // P12 Coral & Jade — "Vibrant, refined, restful". Best for lotus work.
  coralJade: {
    id: 'P12',
    name: 'Coral & Jade',
    dominant: '#F07973',
    coDominant: '#F6B9A5',
    supporting: '#2C9B8E',
    secondary: '#A1D0B9',
    highlight: '#F4E1C5',
  },
  // P02 Lotus Lagoon — "Fresh, restful, botanical".
  lotusLagoon: {
    id: 'P02',
    name: 'Lotus Lagoon',
    dominant: '#F49AA8',
    coDominant: '#F8C8B6',
    supporting: '#35A99C',
    secondary: '#87C7B7',
    highlight: '#F5E5C9',
  },
  // P06 Golden Turquoise — "Radiant, fresh, balanced".
  goldenTurquoise: {
    id: 'P06',
    name: 'Golden Turquoise',
    dominant: '#19A5AE',
    coDominant: '#80C9C7',
    supporting: '#F3BD65',
    secondary: '#F6DDAD',
    highlight: '#E98C79',
  },
  // P04 Peacock Dawn — "Rich, harmonious, joyful".
  peacockDawn: {
    id: 'P04',
    name: 'Peacock Dawn',
    dominant: '#0E8C9C',
    coDominant: '#65C3BA',
    supporting: '#E6AD61',
    secondary: '#F1B8A6',
    highlight: '#F8E5CF',
  },
  // P09 Spring Hibiscus — "Cheerful, energetic, soft".
  springHibiscus: {
    id: 'P09',
    name: 'Spring Hibiscus',
    dominant: '#E97791',
    coDominant: '#F5B2B3',
    supporting: '#8DBF82',
    secondary: '#C6D7A0',
    highlight: '#F7DFB5',
  },
};

export const ORDER = (p: Palette) => [
  p.dominant,
  p.coDominant,
  p.supporting,
  p.secondary,
  p.highlight,
];

/** Canvas-area percentages, straight from the spec. */
export const AREA = [25, 25, 20, 20, 10];

/**
 * The deep value. Warm, never neutral black — on a coral ground a true black
 * vibrates and reads as a hole punched in the picture.
 */
export const INK = {
  warm: '#43251F',
  cool: '#17403C',
  soft: '#6E4A40',
  softCool: '#2F5C57',
};

export const CREAM = '#FBF3E4';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** Rooms are 1536×1024; scaled to fill 1920 tall they are 2880 wide. */
export const ROOM_W = 2880;
export const ROOM_H = 1920;
