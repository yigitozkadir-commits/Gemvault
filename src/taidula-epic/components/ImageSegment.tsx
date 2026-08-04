import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { KenBurnsDirection } from '../segments';

interface ImageSegmentProps {
  src: string;
  direction: KenBurnsDirection;
  durationInFrames: number;
}

/**
 * Statik görselleri "canlı" göstermek için yavaş zoom/pan (Ken Burns) efekti.
 */
export const ImageSegment: React.FC<ImageSegmentProps> = ({
  src,
  direction,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'zoom-in':
      scale = interpolate(progress, [0, 1], [1, 1.12]);
      break;
    case 'zoom-out':
      scale = interpolate(progress, [0, 1], [1.12, 1]);
      break;
    case 'pan-left':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [2, -2]);
      break;
    case 'pan-right':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [-2, 2]);
      break;
    case 'pan-up':
      scale = 1.1;
      translateY = interpolate(progress, [0, 1], [2, -2]);
      break;
    case 'pan-down':
      scale = 1.1;
      translateY = interpolate(progress, [0, 1], [-2, 2]);
      break;
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
