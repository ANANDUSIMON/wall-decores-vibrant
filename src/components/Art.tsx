import React from 'react';
import {Img, staticFile} from 'remotion';

/**
 * A painting on the wall, with the two shadows that stop a photograph of a
 * canvas reading as a sticker: a tight contact shadow in the gap behind the
 * stretcher, and a wide ambient one much further down.
 *
 * On a vibrant ground the shadow is tinted toward the ground's own deep value
 * instead of grey — a grey shadow over coral instantly looks pasted on.
 */
export const Art: React.FC<{
  src: string;
  size: number;
  /** paint-on reveal, 0..1; omit for fully present */
  reveal?: number;
  seed?: number;
  shadowTint?: string;
  rot?: number;
  /** white gallery mat */
  mat?: boolean;
}> = ({src, size, reveal, seed = 1, shadowTint = '67,37,31', rot = 0, mat = false}) => {
  const p = reveal === undefined ? 1 : Math.max(0, Math.min(1, reveal));
  const uid = `art-${seed}`;
  const matW = mat ? Math.max(8, size * 0.028) : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `rotate(${rot}deg)`,
        boxShadow:
          `0 ${size * 0.022}px ${size * 0.04}px rgba(${shadowTint},${0.3 * p}), ` +
          `0 ${size * 0.1}px ${size * 0.16}px rgba(${shadowTint},${0.26 * p})`,
        background: mat ? '#FDFAF2' : 'transparent',
        padding: matW,
        boxSizing: 'border-box',
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
        {p >= 1 ? (
          <Img
            src={staticFile(`art/${src}.png`)}
            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          />
        ) : (
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <filter id={`${uid}-rough`} x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.010 0.028"
                  numOctaves={2}
                  seed={seed}
                  result="n"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale={54}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <feGaussianBlur stdDeviation={2} />
              </filter>
              <mask id={`${uid}-m`}>
                <g filter={`url(#${uid}-rough)`}>
                  <rect
                    x={-70}
                    y={-70}
                    width={p * (size + 150)}
                    height={size + 140}
                    fill="white"
                  />
                </g>
              </mask>
            </defs>
            <image
              href={staticFile(`art/${src}.png`)}
              width={size}
              height={size}
              preserveAspectRatio="xMidYMid slice"
              mask={`url(#${uid}-m)`}
            />
          </svg>
        )}
        {/* raking light across the surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(118deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 26%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.10) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* canvas curves away at the edge */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: `inset 0 0 ${size * 0.06}px rgba(40,20,14,0.14)`,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
