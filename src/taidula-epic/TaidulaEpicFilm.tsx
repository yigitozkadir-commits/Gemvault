import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Timeline, finalFramesFor } from './Timeline';
import { segments, CROSSFADE_FRAMES } from './segments';
import { AnimatedCaptions } from '../components/AnimatedCaptions';
import { TAIDULA_EPIC_CAPTIONS } from '../data/taidulaEpicCaptions';

export const TAIDULA_EPIC_FPS = 30;
export const TAIDULA_EPIC_WIDTH = 1920;
export const TAIDULA_EPIC_HEIGHT = 1080; // 16:9 yatay

// TransitionSeries her geçişte segmentleri crossfade kadar üst üste bindirir,
// bu yüzden toplam süre basit toplamadan (n-1)×crossfade kadar kısadır.
// Her segmentin kendi (değişken) süresi finalFramesFor() ile hesaplanır —
// bkz. Timeline.tsx.
const RAW_TOTAL = segments.reduce(
  (sum, s) => sum + finalFramesFor(s.durationInSeconds),
  0
);
const OVERLAP_TOTAL = (segments.length - 1) * CROSSFADE_FRAMES;
export const TAIDULA_EPIC_DURATION_FRAMES = RAW_TOTAL - OVERLAP_TOTAL; // ~15225 frame ≈ 8:28

/**
 * "TAIDULA — Buz Altında Bir Hükümdar" (v2) — Gök Umay serisinden bağımsız,
 * uzun format (16:9, ~8:33) bir belgesel denemesi. 24 segmentlik crossfade'li
 * bir montaj: 10 AI video kullanımı (8 benzersiz klip, mevcut-a ve
 * mevcut-b-yakin-portre 2'şer kez kullanılıyor — sıcak renk overlay ile
 * ayırt ediliyor) + 14 statik görsel (Ken Burns efektli, değişken süreli).
 * Anlatım gerçek ElevenLabs kelime zamanlamasıyla senkronize
 * <AnimatedCaptions/> ile gösteriliyor.
 */
export const TaidulaEpicFilm: React.FC = () => {
  return (
    <AbsoluteFill>
      <Timeline />
      <AnimatedCaptions cues={TAIDULA_EPIC_CAPTIONS} />
      <Audio src={staticFile('audio/taidula-epic-anlatim.mp3')} />
    </AbsoluteFill>
  );
};
