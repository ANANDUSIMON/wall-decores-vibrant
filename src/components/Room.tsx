import React from 'react';
import {Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {W, H, ROOM_W, ROOM_H} from '../theme';

/**
 * A landscape room photograph framed for a 9:16 screen.
 *
 * The rooms are 1536×1024. Scaled to fill 1920 tall they run 2880 wide, which
 * leaves 1800px of pan latitude — so instead of letterboxing a wide room into
 * a tall frame, the camera *lives inside* it and moves. focusX picks which
 * part of the room the lens is on (0 = far left wall, 1 = far right).
 */
const offsetFor = (focusX: number, zoom: number) => {
  const imgW = ROOM_W * zoom;
  const raw = -(focusX * imgW - W / 2);
  const min = -(imgW - W);
  return Math.max(min, Math.min(0, raw));
};

const offsetYFor = (focusY: number, zoom: number) => {
  const imgH = ROOM_H * zoom;
  const raw = -(focusY * imgH - H / 2);
  const min = -(imgH - H);
  return Math.max(min, Math.min(0, raw));
};

export const Room: React.FC<{
  /** file under public/rooms, without extension */
  src: string;
  /** optional second image, revealed over the first by `reveal` */
  srcB?: string;
  /** 0..1 wipe of srcB over src */
  reveal?: number;
  focusFrom: number;
  focusTo: number;
  focusY?: number;
  zoomFrom?: number;
  zoomTo?: number;
  dur: number;
}> = ({
  src,
  srcB,
  reveal = 0,
  focusFrom,
  focusTo,
  focusY = 0.5,
  zoomFrom = 1.0,
  zoomTo = 1.08,
  dur,
}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoom = zoomFrom + (zoomTo - zoomFrom) * t;
  const focus = focusFrom + (focusTo - focusFrom) * t;
  const x = offsetFor(focus, zoom);
  const y = offsetYFor(focusY, zoom);

  const layer = (file: string) => (
    <Img
      src={staticFile(`rooms/${file}.png`)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: ROOM_W * zoom,
        height: ROOM_H * zoom,
        objectFit: 'cover',
      }}
    />
  );

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {layer(src)}
      {srcB && reveal > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            // an organic, slightly angled wipe rather than a hard vertical bar
            clipPath: `polygon(0 0, ${reveal * 128}% 0, ${reveal * 128 - 28}% 100%, 0 100%)`,
          }}
        >
          {layer(srcB)}
        </div>
      )}
    </div>
  );
};

/** The travelling edge of the A/B wipe, painted as a bright seam of colour. */
export const WipeSeam: React.FC<{reveal: number; color: string}> = ({reveal, color}) => {
  if (reveal <= 0.001 || reveal >= 0.999) return null;
  const x = reveal * 128 - 14;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/*
        A wide, soft bloom rather than a drawn line. The first version used a
        10px near-white bar, which cut across the furniture and read as a
        render glitch instead of light travelling over the wall.
      */}
      <div
        style={{
          position: 'absolute',
          top: '-14%',
          bottom: '-14%',
          left: `${x}%`,
          width: 120,
          marginLeft: -60,
          background: `linear-gradient(90deg, ${color}00 0%, ${color}5c 46%, ${color}7a 50%, ${color}5c 54%, ${color}00 100%)`,
          transform: 'rotate(6.5deg)',
          filter: 'blur(16px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
};
