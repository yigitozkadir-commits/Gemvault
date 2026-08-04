import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { Timeline, FINAL_SEGMENT_FRAMES } from './Timeline';
import { segments, CROSSFADE_FRAMES } from './segments';
import { AnimatedCaptions } from '../components/AnimatedCaptions';
import { TAIDULA_EPIC_CAPTIONS } from '../data/taidulaEpicCaptions';

export const TAIDULA_EPIC_FPS = 30;
export const TAIDULA_EPIC_WIDTH = 1920;
export const TAIDULA_EPIC_HEIGHT = 1080; // 16:9 yatay

// TransitionSeries her geçişte segmentleri crossfade kadar üst üste bindirir,
// bu yüzden toplam süre basit toplamadan (n-1)×crossfade kadar kısadır.
const RAW_TOTAL = segments.length * FINAL_SEGMENT_FRAMES;
const OVERLAP_TOTAL = (segments.length - 1) * CROSSFADE_FRAMES;
export const TAIDULA_EPIC_DURATION_FRAMES = RAW_TOTAL - OVERLAP_TOTAL; // ~8715 frame ≈ 4:50

/**
 * "TAIDULA — Buz Altında Bir Hükümdar" — Gök Umay serisinden bağımsız,
 * uzun format (16:9, ~5dk) bir belgesel denemesi. 20 segmentlik crossfade'li
 * bir montaj: 6 benzersiz AI video klibi (biri, mevcut-b-yakin-portre, 2
 * segmentte tekrar kullanılıyor — sıcak renk overlay ile ayırt ediliyor) +
 * 12 statik görsel (Ken Burns efektli). Anlatım gerçek ElevenLabs kelime
 * zamanlamasıyla senkronize <AnimatedCaptions/> ile gösteriliyor.
 *
 * ÖNEMLİ: Anlatım 230.5sn (6914 frame) sürüyor, video ise 290.5sn (8715
 * frame) — video anlatımdan ~60sn daha uzun, bu yüzden son ~4 segment
 * sessiz kalıyor. Nihai süre kararı (video kısaltılsın mı / SLOWDOWN_FACTOR
 * düşürülsün mü / böyle mi kalsın) netleşene kadar bu haliyle bırakıldı.
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
