import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Palette, CREAM} from '../theme';

/**
 * The vibrant ground every scene sits on.
 *
 * Built as three stacked washes rather than one flat fill: a broad atmospheric
 * field (the spec's 45–55%), a subordinate cool structure, and a cream rest
 * zone. The washes drift very slowly against each other, which keeps a light
 * background alive without anything visibly "animating".
 */
export const Ground: React.FC<{
  pal: Palette;
  /** flips which corner the cool structure occupies */
  mirror?: boolean;
  /** 0 = calm, 1 = maximum chroma */
  energy?: number;
}> = ({pal, mirror = false, energy = 1}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 300], [0, 1], {extrapolateRight: 'clamp'});
  const a = mirror ? 100 - drift * 6 : drift * 6;
  const b = mirror ? drift * 8 : 100 - drift * 8;

  return (
    <AbsoluteFill>
      {/* soft atmosphere — the dominant field */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${mirror ? 200 : 160}deg,
            ${pal.coDominant} 0%,
            ${pal.dominant} 52%,
            ${pal.coDominant} 100%)`,
        }}
      />
      {/* cool structural mass, held to roughly a quarter of the frame */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(76% 54% at ${a}% ${mirror ? 18 : 86}%,
            ${pal.supporting} 0%,
            ${pal.secondary} 38%,
            transparent 72%)`,
          opacity: 0.88 * energy,
        }}
      />
      {/* cream rest zone — the breathing room the spec asks for */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(62% 40% at ${b}% ${mirror ? 78 : 22}%,
            ${pal.highlight} 0%,
            ${CREAM}00 70%)`,
          opacity: 0.8,
        }}
      />
      {/* a whisper of paper tooth so the flat areas aren't digital-clean */}
      <AbsoluteFill style={{opacity: 0.055, mixBlendMode: 'multiply'}}>
        <svg width="100%" height="100%">
          <filter id="tooth">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tooth)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Slowly rotating lotus-geometry arcs — the film's one recurring motif. */
export const PetalArcs: React.FC<{
  pal: Palette;
  cx: number;
  cy: number;
  r: number;
  speed?: number;
  opacity?: number;
  petals?: number;
}> = ({pal, cx, cy, r, speed = 1, opacity = 0.3, petals = 12}) => {
  const f = useCurrentFrame();
  const rot = (f * 0.14 * speed) % 360;
  const cols = [pal.supporting, pal.highlight, pal.secondary];
  return (
    <svg
      width={1080}
      height={1920}
      style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}
    >
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        {Array.from({length: petals}).map((_, i) => {
          const a = (i / petals) * Math.PI * 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={r * 0.34}
              ry={r * 0.13}
              transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
              fill="none"
              stroke={cols[i % cols.length]}
              strokeWidth={2.4}
            />
          );
        })}
      </g>
    </svg>
  );
};

/** A broad colour wash that sweeps across — used to carry a transition. */
export const WashSweep: React.FC<{
  color: string;
  progress: number;
  angle?: number;
  width?: number;
}> = ({color, progress, angle = 108, width = 46}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(${angle}deg,
        transparent ${50 - width / 2}%,
        ${color} 50%,
        transparent ${50 + width / 2}%)`,
      transform: `translateX(${interpolateRaw(progress)}%)`,
      mixBlendMode: 'soft-light',
      pointerEvents: 'none',
    }}
  />
);

const interpolateRaw = (p: number) => -120 + p * 240;
