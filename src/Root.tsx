import React from 'react';
import {Composition} from 'remotion';
import {Film, TOTAL, SCENES} from './Film';
import {FPS, W, H} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Film"
      component={Film}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
    />
    {SCENES.map(({C, dur}, i) => (
      <Composition
        key={i}
        id={`S${i + 1}`}
        component={C}
        durationInFrames={dur}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
