import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ImageSegment } from '../taidula-epic/components/ImageSegment';
import { AnimatedCaptions } from '../components/AnimatedCaptions';
import { pages, CROSSFADE_FRAMES, TOTAL_FRAMES } from './pages';
import { BOZKIRIN_UYANISI_CAPTIONS } from '../data/bozkirinUyanisiCaptions';

export const BOZKIRIN_UYANISI_FPS = 30;
export const BOZKIRIN_UYANISI_WIDTH = 1920;
export const BOZKIRIN_UYANISI_HEIGHT = 1080; // 16:9 yatay
export const BOZKIRIN_UYANISI_DURATION_FRAMES = TOTAL_FRAMES;

const INTRO_FADE_FRAMES = 20;
const OUTRO_FADE_FRAMES = 30;
const NARRATION_SRC = 'audio/bozkirin-uyanisi-anlatim.mp3';

/**
 * "Bozkırın Uyanışı — Umay ve Kağan'ın Destanı" — Video Master Planı'ndaki
 * "PDF kısmı + seslendirme" bölümü. Resimli çocuk kitabının 11 sayfası
 * (kapak + 9 anlatılan sahne + arka kapak), her biri kendi Ken Burns
 * hareketiyle, sayfalar arası kısa crossfade'lerle gösteriliyor.
 *
 * NOT: Sayfa zamanlaması (pages.ts) gerçek ElevenLabs kelime zamanlamasından
 * türetildi — anlatım ve altyazılarla mutlak (absolute frame) senkron
 * olması gerektiği için @remotion/transitions'ın TransitionSeries'i
 * KULLANILMADI (o, segmentleri crossfade kadar üst üste bindirip toplam
 * süreyi kısaltıyor — bu da anlatımla görsel zamanlamayı sayfa sayfa
 * kaydırırdı). Bunun yerine her sayfa kendi mutlak <Sequence>'inde
 * gösteriliyor, crossfade ise komşu sayfaların opacity'sini sınırda
 * çakıştırarak elde ediliyor — toplam süre değişmiyor.
 *
 * Anlatım gerçek ElevenLabs kelime zamanlamasıyla senkronize
 * <AnimatedCaptions/> ile gösteriliyor.
 *
 * HENÜZ EKLENMEDİ (master plandaki sonraki adımlar):
 *  - 3x10sn Google Flow AI video sahnesi (bulutların yarılması, tohum/çiçek
 *    dönüşümü, buzun kırılması) — şu an o anlarda ilgili sayfa görseli
 *    devam ediyor, kesinti/siyah kare yok.
 *  - Arka plan müziği ve SFX katmanları (rehber dokümanındaki faz/BPM
 *    planına göre) — şu an sessiz, sadece anlatım var.
 *  - "GÜM!" davul vuruşu efekti (sayfa 5, ~03:45).
 */
export const BozkirinUyanisiFilm: React.FC = () => {
  const frame = useCurrentFrame();

  const introFade = interpolate(frame, [0, INTRO_FADE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroFade = interpolate(
    frame,
    [TOTAL_FRAMES - OUTRO_FADE_FRAMES, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const globalOpacity = Math.min(introFade, outroFade);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a08', opacity: globalOpacity }}>
      {pages.map((page, index) => {
        const isFirst = index === 0;
        const isLast = index === pages.length - 1;
        const duration = page.endFrame - page.startFrame;

        // Komşu sayfalarla crossfade: girişte (ilk sayfa hariç) fade-in,
        // çıkışta (son sayfa hariç) fade-out — sınırda üst üste biner.
        const pageOpacity = Math.min(
          isFirst
            ? 1
            : interpolate(frame, [page.startFrame, page.startFrame + CROSSFADE_FRAMES], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
          isLast
            ? 1
            : interpolate(frame, [page.endFrame - CROSSFADE_FRAMES, page.endFrame], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
        );

        if (pageOpacity <= 0) return null;

        return (
          <AbsoluteFill key={page.id} style={{ opacity: pageOpacity }}>
            <Sequence from={page.startFrame} durationInFrames={duration}>
              <ImageSegment src={page.src} direction={page.kenBurns} durationInFrames={duration} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      <AnimatedCaptions cues={BOZKIRIN_UYANISI_CAPTIONS} />

      <Audio src={staticFile(NARRATION_SRC)} volume={1} />
    </AbsoluteFill>
  );
};
