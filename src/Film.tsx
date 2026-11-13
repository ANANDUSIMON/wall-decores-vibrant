import React, {useState, useEffect} from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
} from 'remotion';
import {PAL, ORDER, AREA, INK, CREAM, SERIF, SANS, W, H} from './theme';
import {Ground, PetalArcs, WashSweep} from './components/Ground';
import {Room, WipeSeam} from './components/Room';
import {Art} from './components/Art';
import {Rise, Kicker, Swatch} from './components/Type';

/* ------------------------------------------------------------- helpers */

const FontGate: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    let alive = true;
    const r = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();
    r.then(() => alive && continueRender(h));
    return () => {
      alive = false;
    };
  }, [h]);
  return null;
};

const ramp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 14, dur - 14, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity: op}}>{children}</AbsoluteFill>;
};

/**
 * Text sits over rooms on a warm palette scrim — never a black bar.
 *
 * Tuned down hard from the first pass: a scrim only has to carry the type,
 * and at the earlier strength it was tinting the whole lower half of each
 * room orange and flattening the furniture the shot exists to show.
 */
const Scrim: React.FC<{from: string; height?: string}> = ({from, height = '38%'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height,
      background: `linear-gradient(to top, ${from}e0 0%, ${from}96 26%, ${from}38 58%, ${from}00 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const TopScrim: React.FC<{from: string}> = ({from}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '20%',
      background: `linear-gradient(to bottom, ${from}8c 0%, ${from}30 48%, ${from}00 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const Block: React.FC<{bottom?: number; top?: number; children: React.ReactNode; gap?: number}> = ({
  bottom,
  top,
  children,
  gap = 20,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 76,
      right: 76,
      ...(bottom !== undefined ? {bottom} : {}),
      ...(top !== undefined ? {top} : {}),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap,
    }}
  >
    {children}
  </div>
);

const Pop: React.FC<{delay?: number; from?: number; children: React.ReactNode}> = ({
  delay = 0,
  from = 0.68,
  children,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: f - delay,
    fps,
    config: {damping: 14, mass: 0.8, stiffness: 118},
    durationInFrames: 40,
  });
  return (
    <div
      style={{
        transform: `scale(${interpolate(s, [0, 1], [from, 1]).toFixed(3)})`,
        opacity: ramp(f - delay, 0, 10),
      }}
    >
      {children}
    </div>
  );
};

/* --------------------------------------------------------------- scenes */

/** S1 — OPEN. Coral ground, the painting arrives as paint. 5.0s */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const p = PAL.coralJade;
  const reveal = ramp(f, 8, 76);
  const sc = interpolate(f, [0, 150], [1.06, 1.0]);
  return (
    <AbsoluteFill>
      <Ground pal={p} />
      <PetalArcs pal={p} cx={540} cy={700} r={430} opacity={0.26} speed={1} />
      <AbsoluteFill style={{transform: `scale(${sc.toFixed(4)})`}}>
        <div style={{position: 'absolute', left: 540 - 380, top: 700 - 380}}>
          <Art src="a8_turquoise" size={760} reveal={reveal} seed={3} shadowTint="120,52,44" />
        </div>
      </AbsoluteFill>
      <Block bottom={360} gap={22}>
        <Kicker text="Wall Decores" size={25} delay={58} color={INK.warm} />
        <Rise
          text="Every wall tells a story."
          size={76}
          delay={70}
          color={INK.warm}
          maxWidth={840}
        />
      </Block>
      <WashSweep color={p.highlight} progress={ramp(f, 20, 110)} />
    </AbsoluteFill>
  );
};

/**
 * S2 — THE CHOICE. 6.0s
 * The same room, twice, wiped one over the other. This is the whole business
 * argument in four seconds: the wall doesn't change, the art does, and the
 * room becomes a different room.
 */
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const p = PAL.coralJade;
  const reveal = ramp(f, 56, 128);
  return (
    <AbsoluteFill>
      <Room
        src="r2_sofa_b"
        srcB="r2_sofa_a"
        reveal={reveal}
        focusFrom={0.58}
        focusTo={0.84}
        zoomFrom={1.02}
        zoomTo={1.12}
        dur={180}
      />
      <WipeSeam reveal={reveal} color={p.highlight} />
      <TopScrim from="#F6B9A5" />
      <Scrim from="#D8553F" height="36%" />
      <Block top={76}>
        <Kicker text="Same wall · Different story" size={23} delay={10} color="#5A2B22" />
      </Block>
      <Block bottom={150} gap={14}>
        <Rise text="You choose the" size={60} delay={74} color={CREAM} />
        <Rise
          text="piece it deserves."
          size={60}
          delay={86}
          color="#FFE9C9"
          italic
          shadow="0 2px 18px rgba(90,30,20,0.3)"
        />
      </Block>
    </AbsoluteFill>
  );
};

/**
 * S3 — THE PALETTE. The spec made visible. 5.0s
 *
 * Ground and chips are deliberately opposed: a deep teal field (P04) carrying
 * the coral/cream chips of P12. The first pass put pink chips on a pink
 * ground and three of the five disappeared — a palette scene has to be the
 * one place in the film where every colour is unmistakably legible.
 */
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const ground = PAL.peacockDawn;
  const show = PAL.coralJade;
  const cols = ORDER(show);
  return (
    <AbsoluteFill>
      <Ground pal={ground} mirror />
      <PetalArcs pal={ground} cx={540} cy={1010} r={520} opacity={0.22} speed={-0.8} petals={16} />
      <Block top={286} gap={24}>
        <Kicker text="Colour, decided" size={24} delay={6} color="#CFF0E7" />
        <Rise
          text="Mixed for your room."
          size={68}
          delay={16}
          color={CREAM}
          maxWidth={860}
          shadow="0 2px 20px rgba(6,52,58,0.3)"
        />
      </Block>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 900,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 30,
        }}
      >
        {cols.map((c, i) => (
          <Swatch
            key={c}
            hex={c}
            pct={AREA[i]}
            delay={44 + i * 9}
            size={126}
            labelColor="#DFF3EE"
          />
        ))}
      </div>
      {/* Naming the palette closes the gap the chips left and tells the
          viewer these are real, chosen schemes rather than decoration. */}
      <Block bottom={510} gap={10}>
        <Rise
          text={`${show.id} · ${show.name}`}
          size={30}
          delay={92}
          color="#FFE3C9"
          font={SANS}
          weight={700}
          tracking="0.2em"
        />
      </Block>
      <Block bottom={330} gap={12}>
        <Rise
          text="Not a print run — a palette built for your light."
          size={37}
          delay={104}
          color="#DFF3EE"
          font={SANS}
          weight={600}
          maxWidth={860}
          lineHeight={1.4}
        />
      </Block>
      <WashSweep color={show.highlight} progress={ramp(f, 30, 130)} width={30} />
    </AbsoluteFill>
  );
};

/** S4 — THE POOJA WALL. A slow push onto a hung piece. 6.0s */
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room
        src="r4_pooja_a"
        focusFrom={0.46}
        focusTo={0.30}
        focusY={0.46}
        zoomFrom={1.02}
        zoomTo={1.2}
        dur={180}
      />
      <TopScrim from="#2C9B8E" />
      <Scrim from="#1F7D74" height="40%" />
      <Block top={78}>
        <Kicker text="Made to the wall" size={23} delay={12} color="#D8F2EC" />
      </Block>
      <Block bottom={150} gap={14}>
        <Rise text="Sized, framed, hung." size={58} delay={54} color={CREAM} />
        <Rise
          text="Finished in your home."
          size={58}
          delay={68}
          color="#CFF0E7"
          italic
        />
      </Block>
    </AbsoluteFill>
  );
};

/** S5 — THE RANGE. Six pieces land on a turquoise ground. 5.0s */
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const p = PAL.goldenTurquoise;
  /**
   * Two rows of three on a centred 290px pitch. The first pass used wider
   * sizes on the same centres and the pieces ate into each other — on a
   * salon wall the gaps are what let the eye read each piece as separate.
   */
  const grid = [
    {src: 'a2_overhead', x: 270, y: 726, s: 244, d: 4, r: -2.5},
    {src: 'a7_emerald', x: 540, y: 690, s: 262, d: 12, r: 1.8},
    {src: 'a5_jade', x: 812, y: 740, s: 232, d: 20, r: -1.2},
    {src: 'a1_walnut', x: 268, y: 1028, s: 228, d: 28, r: 2.2},
    {src: 'a4_ribbons', x: 540, y: 1000, s: 250, d: 36, r: -1.6},
    {src: 'a6_deco', x: 814, y: 1036, s: 220, d: 44, r: 2.6},
  ];
  return (
    <AbsoluteFill>
      <Ground pal={p} />
      <PetalArcs pal={p} cx={540} cy={880} r={560} opacity={0.18} speed={0.7} petals={14} />
      <Block top={250} gap={18}>
        <Kicker text="The collections" size={24} delay={4} color="#0B4E55" />
        <Rise text="A language, not a catalogue." size={56} delay={12} color="#0B4E55" maxWidth={860} />
      </Block>
      {grid.map((g) => (
        <div key={g.src} style={{position: 'absolute', left: g.x - g.s / 2, top: g.y - g.s / 2}}>
          <Pop delay={g.d}>
            <Art src={g.src} size={g.s} rot={g.r} shadowTint="10,62,68" mat />
          </Pop>
        </div>
      ))}
      <Block bottom={232}>
        <Rise
          text="Oil · impasto · gold leaf"
          size={38}
          delay={74}
          color="#0B4E55"
          font={SANS}
          weight={700}
          maxWidth={900}
        />
      </Block>
      <WashSweep color={p.secondary} progress={ramp(f, 24, 120)} />
    </AbsoluteFill>
  );
};

/** S6 — THE ENTRANCE. The wide view, art on both walls. 5.0s */
export const S6: React.FC = () => {
  return (
    <AbsoluteFill>
      {/*
        The art in this room lives on the far walls; the centre is window and
        curtain. A pan across the middle therefore showed nothing — so the
        move now starts on the tall right-hand panel and eases back to take in
        the seating, rather than travelling through dead wall.
      */}
      <Room
        src="r1_entrance_a"
        focusFrom={0.92}
        focusTo={0.70}
        zoomFrom={1.2}
        zoomTo={1.04}
        dur={150}
      />
      <TopScrim from="#E6AD61" />
      <Scrim from="#C4762F" height="40%" />
      <Block top={76}>
        <Kicker text="Angamaly · Kerala" size={23} delay={10} color="#FFF0D6" />
      </Block>
      <Block bottom={160} gap={12}>
        <Rise text="Five years." size={62} delay={46} color={CREAM} />
        <Rise text="One studio." size={62} delay={58} color="#FFE7BE" italic />
      </Block>
    </AbsoluteFill>
  );
};

/** S7 — LOCKUP. 3.0s */
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const p = PAL.coralJade;
  const rule = interpolate(f, [34, 64], [0, 400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <Ground pal={p} mirror energy={0.85} />
      <PetalArcs pal={p} cx={540} cy={960} r={600} opacity={0.22} speed={0.5} petals={18} />
      <div style={{position: 'absolute', left: 540 - 150, top: 470}}>
        <Pop delay={4} from={0.72}>
          <Art src="a2_overhead" size={300} seed={9} shadowTint="120,52,44" mat />
        </Pop>
      </div>
      <Block top={880} gap={16}>
        <Rise
          text="WALL DECORES"
          size={84}
          delay={14}
          color={INK.warm}
          weight={700}
          tracking="0.05em"
        />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: '#1F7D74',
            opacity: ramp(f, 36, 54),
            paddingLeft: '0.44em',
          }}
        >
          Artisan Collectives
        </div>
        <div
          style={{
            width: rule,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${p.supporting}, ${p.dominant}, transparent)`,
            marginTop: 8,
          }}
        />
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 40,
            fontStyle: 'italic',
            color: INK.warm,
            opacity: ramp(f, 50, 68),
            marginTop: 4,
          }}
        >
          Handcrafted in Kerala
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '0.03em',
            color: INK.soft,
            opacity: ramp(f, 62, 80),
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          walldecores.com &nbsp;·&nbsp; @wall_decores_artisan &nbsp;·&nbsp; 9037790012
        </div>
      </Block>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ root */

export const SCENES: {C: React.FC; from: number; dur: number}[] = [
  {C: S1, from: 0, dur: 150},
  {C: S2, from: 144, dur: 180},
  {C: S3, from: 318, dur: 150},
  {C: S4, from: 462, dur: 180},
  {C: S5, from: 636, dur: 150},
  {C: S6, from: 780, dur: 150},
  {C: S7, from: 924, dur: 126},
];

export const TOTAL = 1050;

export const Film: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: PAL.coralJade.coDominant}}>
    <FontGate />
    {SCENES.map(({C, from, dur}, i) => (
      <Sequence key={i} from={from} durationInFrames={dur} name={`S${i + 1}`}>
        <Fade dur={dur}>
          <C />
        </Fade>
      </Sequence>
    ))}
    <Grain />
  </AbsoluteFill>
);

/** Light, warm grain. Overlay blend keeps it from greying the vibrant ground. */
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{opacity: 0.035, mixBlendMode: 'overlay', pointerEvents: 'none'}}
    >
      <svg width="100%" height="100%">
        <filter id={`g-${f % 48}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={f % 48}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g-${f % 48})`} />
      </svg>
    </AbsoluteFill>
  );
};
