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
 * Her segmentin FINAL süresi kendi durationInSeconds değerinden hesaplanır:
 * finalFrames = (durationInSeconds × HAM_FPS) / SLOWDOWN_FACTOR
 *
 * Video segmentleri hep 10s ham bildirir (Google Flow'un fiziksel klip
 * uzunluğu) → playbackRate (segment.customPlaybackRate ?? SLOWDOWN_FACTOR)
 * ile bu ham içerik final süreye doğal yavaş çekimle yayılır.
 * Görsellerde "playbackRate" kavramı yok — Ken Burns efekti doğrudan o
 * segmentin kendi (değişken, daha uzun) final frame sayısı üzerinden
 * hesaplanır.
 */
export const finalFramesFor = (durationInSeconds: number) =>
  Math.round((durationInSeconds * HAM_FPS) / SLOWDOWN_FACTOR);

export const Timeline: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const segmentFinalFrames = finalFramesFor(segment.durationInSeconds);

          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={segmentFinalFrames}>
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
                    durationInFrames={segmentFinalFrames}
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
