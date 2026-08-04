import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { StorybookPage } from './components/StorybookPage';
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
const MUSIC_SRC = 'audio/bozkirin-uyanisi-muzik.mp3';

// Ses miksaj rehberindeki ducking mantığı: anlatım sürerken müzik kısık
// (%25), sessizlik anlarında (giriş/kapanış) müzik daha belirgin (%65).
const MUSIC_DUCK_VOLUME = 0.25;
const MUSIC_SOLO_VOLUME = 0.65;
const DUCK_RAMP_FRAMES = 30;
const NARRATION_START_FRAME = pages.find((p) => p.id === 2)!.startFrame; // 152
const NARRATION_END_FRAME = pages.find((p) => p.id === 10)!.endFrame; // 8697

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
 *  - "GÜM!" davul vuruşu efekti (sayfa 5, ~03:45).
 *
 * ARKA PLAN MÜZİĞİ: ElevenLabs Music API (POST /v1/music) ile, ses
 * rehberindeki "Tam Parça Atmosferi" master prompt'unun İngilizce
 * uyarlamasıyla, videonun tam süresine (294.9sn) birebir uzunlukta tek
 * parça olarak üretildi — soğuk/yalnız açılıştan mistik davul/vokal
 * katmanına, coşkulu tam orkestra doruğuna, sıcak ninni kapanışına kadar
 * tüm yayı tek promptla kapsıyor. Ducking: anlatım süresince %25, giriş/
 * kapanışta %65 (bkz. MUSIC_DUCK_VOLUME/MUSIC_SOLO_VOLUME).
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

  let musicVolume: number;
  if (frame <= NARRATION_START_FRAME) {
    musicVolume = interpolate(
      frame,
      [NARRATION_START_FRAME - DUCK_RAMP_FRAMES, NARRATION_START_FRAME],
      [MUSIC_SOLO_VOLUME, MUSIC_DUCK_VOLUME],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (frame < NARRATION_END_FRAME) {
    musicVolume = MUSIC_DUCK_VOLUME;
  } else {
    musicVolume = interpolate(
      frame,
      [NARRATION_END_FRAME, NARRATION_END_FRAME + DUCK_RAMP_FRAMES],
      [MUSIC_DUCK_VOLUME, MUSIC_SOLO_VOLUME],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }
  // Global giriş/çıkış fade'i müziğe de uygulanır.
  musicVolume *= Math.min(introFade, outroFade);

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
              <StorybookPage src={page.src} direction={page.kenBurns} durationInFrames={duration} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      <AnimatedCaptions cues={BOZKIRIN_UYANISI_CAPTIONS} bottomOffsetRatio={0.035} />

      <Audio src={staticFile(NARRATION_SRC)} volume={1} />
      <Audio src={staticFile(MUSIC_SRC)} volume={musicVolume} />
    </AbsoluteFill>
  );
};
