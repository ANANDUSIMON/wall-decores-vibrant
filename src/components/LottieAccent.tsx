import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {Lottie, type LottieAnimationData} from '@remotion/lottie';
import type {Palette} from '../theme';
import {ORDER} from '../theme';

const hexToLottieColor = (hex: string): [number, number, number, number] => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b, 1];
};

/**
 * Each distinct solid fill ("fl" shape item) found in the file is mapped to
 * the next color in the supplied palette (cycling if there are more fills
 * than palette colors), keyed by its original RGB so the same shape lands on
 * the same brand color across every frame of the animation.
 */
const recolor = (node: unknown, palette: string[], seen: Map<string, string>): unknown => {
  if (Array.isArray(node)) {
    return node.map((n) => recolor(n, palette, seen));
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    if (obj.ty === 'fl' && obj.c && typeof obj.c === 'object') {
      const c = obj.c as {k: unknown};
      if (Array.isArray(c.k) && c.k.length >= 3) {
        const key = (c.k as number[]).slice(0, 3).map((n) => n.toFixed(3)).join(',');
        if (!seen.has(key)) {
          seen.set(key, palette[seen.size % palette.length]);
        }
        return {...obj, c: {...c, k: hexToLottieColor(seen.get(key) as string)}};
      }
    }
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = recolor(v, palette, seen);
    }
    return result;
  }
  return node;
};

export type LottieAccentProps = {
  /** Filename inside public/lottie/, e.g. "sparkle.json" */
  src: string;
  width: number;
  height: number;
  loop?: boolean;
  /** When set, remaps the Lottie's solid fills onto this brand palette. */
  palette?: Palette;
};

/** Drop-in Lottie accent, not yet wired into any scene. */
export const LottieAccent: React.FC<LottieAccentProps> = ({
  src,
  width,
  height,
  loop = true,
  palette,
}) => {
  const [handle] = useState(() => delayRender(`lottie-${src}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(staticFile(`lottie/${src}`))
      .then((res) => res.json())
      .then((json: LottieAnimationData) => {
        if (!alive) return;
        const recolored = palette
          ? (recolor(json, ORDER(palette), new Map()) as LottieAnimationData)
          : json;
        setData(recolored);
        continueRender(handle);
      })
      .catch((err) => {
        continueRender(handle);
        throw err;
      });
    return () => {
      alive = false;
    };
  }, [src, palette, handle]);

  if (!data) return null;

  return (
    <div style={{width, height, overflow: 'hidden'}}>
      <Lottie animationData={data} loop={loop} style={{width, height}} />
    </div>
  );
};
