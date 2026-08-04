import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { ColorVariant } from '../segments';

interface VideoSegmentProps {
  src: string;
  playbackRate: number;
  colorVariant?: ColorVariant;
}

/**
 * AI Video sahnelerini oynatır. playbackRate < 1 verildiğinde (örn. 0.667)
 * kaynak klip doğal olarak yavaşlar ve sequence süresine yayılır.
 *
 * Tekrar kullanılan klipler (reused: true, segments.ts'te) için hafif bir
 * renk overlay uygulanır — "kopya-yapıştır" hissini kırmak amacıyla:
 *   - cool  : açılışta soğuk/donuk ton
 *   - warm  : tekrar/kapanışta sıcak altın ton ("zaman geçmiş" hissi)
 */
export const VideoSegment: React.FC<VideoSegmentProps> = ({
  src,
  playbackRate,
  colorVariant = 'neutral',
}) => {
  const overlayColor =
    colorVariant === 'warm'
      ? 'rgba(255, 176, 60, 0.14)'
      : colorVariant === 'cool'
      ? 'rgba(90, 140, 200, 0.10)'
      : 'transparent';

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <OffthreadVideo
        src={staticFile(src)}
        playbackRate={playbackRate}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {colorVariant !== 'neutral' && (
        <AbsoluteFill
          style={{
            backgroundColor: overlayColor,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
