import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import {
  segments,
  HAM_FPS,
  SLOWDOWN_FACTOR,
  CROSSFADE_FRAMES,
} from './segments';
import { VideoSegment } from './components/VideoSegment';
import { ImageSegment } from './components/ImageSegment';

/**
 * Her segment FINAL timeline'da 15sn (450 frame) yer kaplar.
 *
 * Video segmentleri için playbackRate (segment.customPlaybackRate ??
 * SLOWDOWN_FACTOR) ile OffthreadVideo, ham içeriği 450 frame'e yayarak
 * doğal yavaş çekim üretir. Görsel segmentlerde Ken Burns efekti doğrudan
 * 450 frame üzerinden hesaplanır.
 */

const HAM_DURATION_FRAMES = 10 * HAM_FPS; // 300
export const FINAL_SEGMENT_FRAMES = Math.round(HAM_DURATION_FRAMES / SLOWDOWN_FACTOR); // ~450

export const Timeline: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={FINAL_SEGMENT_FRAMES}>
                {segment.type === 'video' ? (
                  <VideoSegment
                    src={segment.src}
                    playbackRate={segment.customPlaybackRate ?? SLOWDOWN_FACTOR}
                    colorVariant={segment.colorVariant}
                  />
                ) : (
                  <ImageSegment
                    src={segment.src}
                    direction={segment.kenBurns ?? 'zoom-in'}
                    durationInFrames={FINAL_SEGMENT_FRAMES}
                  />
                )}
              </TransitionSeries.Sequence>

              {!isLast && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: CROSSFADE_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
