import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { StorybookPage } from './components/StorybookPage';
import { ImageSegment } from '../taidula-epic/components/ImageSegment';
import { AnimatedCaptions } from '../components/AnimatedCaptions';
import {
  segments,
  cutaways,
  CROSSFADE_FRAMES,
  TOTAL_FRAMES,
  GUM_FRAME,
  GUM_TRIPLE_FRAME,
  NARRATED_RANGES,
} from './timelineV2';
import { BOZKIRIN_UYANISI_CAPTIONS_V2 } from '../data/bozkirinUyanisiCaptionsV2';

export const BOZKIRIN_UYANISI_V2_FPS = 30;
export const BOZKIRIN_UYANISI_V2_WIDTH = 1920;
export const BOZKIRIN_UYANISI_V2_HEIGHT = 1080;
export const BOZKIRIN_UYANISI_V2_DURATION_FRAMES = TOTAL_FRAMES;

const INTRO_FADE_FRAMES = 20;
const OUTRO_FADE_FRAMES = 30;
const NARRATION_SRC = 'audio/bozkirin-uyanisi-anlatim-v2.mp3';
const MUSIC_SRC = 'audio/bozkirin-uyanisi-muzik-uzun.mp3';
const SFX = 'audio/sfx';

const MUSIC_DUCK_VOLUME = 0.22;
const MUSIC_SOLO_VOLUME = 0.6;
const DUCK_RAMP_FRAMES = 25;

const isNarrating = (frame: number) =>
  NARRATED_RANGES.some(([s, e]) => frame >= s && frame < e);

/**
 * "Bozkırın Uyanışı" v2 — 12 yeni statik görsel, 3 Google Flow AI videosu ve
 * yeni bir kapanış videosuyla genişletilmiş kurgu. Tüm zamanlama
 * src/bozkirin-uyanisi/timelineV2.ts içinde — bkz. o dosyanın ve
 * docs/bozkirin-uyanisi-uretim-plani.md'nin üretim notları.
 *
 * Mimari: her segment kendi mutlak (absolute) frame aralığında bağımsız
 * bir <Sequence>; komşu segmentler arası crossfade, sınırda opacity
 * çakıştırmasıyla elde ediliyor (bkz. BozkirinUyanisiFilm.tsx'teki aynı
 * teknik notu — TransitionSeries KULLANILMIYOR çünkü o segmentleri üst
 * üste bindirip toplam süreyi kısaltır, bu da anlatım senkronunu bozar).
 *
 * Anlatım artık TEK bir sürekli ses dosyası değil — sayfalar arasına
 * eklenen müzik-only boşluklara denk gelen SESSİZLİK doğrudan
 * bozkirin-uyanisi-anlatim-v2.mp3 dosyasının içine splice edildi, bu
 * yüzden narration Audio'su hâlâ frame 0'dan tek parça çalıyor gibi
 * davranılabilir (video ile senkronu otomatik).
 */
export const BozkirinUyanisiFilmV2: React.FC = () => {
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

  // Müzik ducking: anlatımlı sayfa aralıklarında kısık, ara
  // sahnelerde/videolarda belirgin. Sınırlarda kısa rampa ile yumuşatılır.
  let musicVolume = MUSIC_SOLO_VOLUME;
  const narrating = isNarrating(frame);
  if (narrating) {
    musicVolume = MUSIC_DUCK_VOLUME;
  } else {
    // Bir sonraki/önceki narrated aralığa yakınsa rampa uygula
    for (const [s, e] of NARRATED_RANGES) {
      if (frame >= s - DUCK_RAMP_FRAMES && frame < s) {
        musicVolume = interpolate(frame, [s - DUCK_RAMP_FRAMES, s], [MUSIC_SOLO_VOLUME, MUSIC_DUCK_VOLUME], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
      if (frame >= e && frame < e + DUCK_RAMP_FRAMES) {
        musicVolume = interpolate(frame, [e, e + DUCK_RAMP_FRAMES], [MUSIC_DUCK_VOLUME, MUSIC_SOLO_VOLUME], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
    }
  }
  // "GÜM!" vuruşunda müzik ~1sn içinde sıfırlanır.
  const gumDuck = interpolate(
    frame,
    [GUM_FRAME - 10, GUM_FRAME, GUM_FRAME + 20],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  musicVolume *= gumDuck;
  musicVolume *= Math.min(introFade, outroFade);

  const windVolume = interpolate(frame, [0, 480, 510], [0.35, 0.35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const birdVolume = interpolate(
    frame,
    [6913, 6973, 8493, 8553],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a08', opacity: globalOpacity }}>
      {segments.map((seg, index) => {
        const isLast = index === segments.length - 1;
        const duration = seg.endFrame - seg.startFrame;

        // ÖNEMLİ: Sequence'ler [start, end) yarı-açık aralıklarla mount
        // olur, yani bir segment endFrame'de tamamen unmount olur ve
        // sonraki segment TAM O KAREDE mount olur — ikisi de aynı anda
        // ekranda değildir. Eskiden her iki segment de sınırda opacity 0
        // veriyordu (biri "henüz başlamadı", diğeri "bitti") ve sonuçta
        // her geçişte 1 karelik SİYAH YANIP SÖNME oluyordu. Düzeltme:
        // her segment (son hariç) kendi mantıksal süresinin ÖTESİNE,
        // CROSSFADE_FRAMES kadar uzatılmış şekilde mount ediliyor ve o
        // uzatılmış kuyrukta 1'den 0'a soluyor — böylece bir sonraki
        // segmentin (hep opacity 1, hiç solmayan, altta duran) üzerine
        // gerçekten çakışarak crossfade oluşuyor. z-index, önceki
        // segmentin üstte kalmasını sağlıyor.
        const mountDuration = isLast ? duration : duration + CROSSFADE_FRAMES;
        const segOpacity = isLast
          ? 1
          : interpolate(frame, [seg.endFrame - CROSSFADE_FRAMES, seg.endFrame], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

        if (segOpacity <= 0 && frame >= seg.endFrame) return null;
        if (frame < seg.startFrame) return null;

        return (
          <AbsoluteFill
            key={`${seg.kind}-${seg.startFrame}`}
            style={{ opacity: segOpacity, zIndex: segments.length - index }}
          >
            <Sequence from={seg.startFrame} durationInFrames={mountDuration}>
              {seg.kind === 'storybook' && (
                <StorybookPage src={seg.src} direction={seg.kenBurns ?? 'zoom-in'} durationInFrames={duration} />
              )}
              {seg.kind === 'image' && (
                <ImageSegment src={seg.src} direction={seg.kenBurns ?? 'zoom-in'} durationInFrames={duration} />
              )}
              {seg.kind === 'video' && (
                <AbsoluteFill style={{ backgroundColor: '#000' }}>
                  <OffthreadVideo
                    src={staticFile(seg.src)}
                    volume={0}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AbsoluteFill>
              )}
            </Sequence>
          </AbsoluteFill>
        );
      })}

      {/* Karakter ara görselleri — sayfa akışını kesmeden kısa bindirme */}
      {cutaways.map((c) => {
        const dur = c.endFrame - c.startFrame;
        const fadeEdge = Math.min(10, Math.floor(dur / 4));
        const op = Math.min(
          interpolate(frame, [c.startFrame, c.startFrame + fadeEdge], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          interpolate(frame, [c.endFrame - fadeEdge, c.endFrame], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        );
        if (op <= 0) return null;
        return (
          <AbsoluteFill key={c.src + c.startFrame} style={{ opacity: op }}>
            <Sequence from={c.startFrame} durationInFrames={dur}>
              <ImageSegment src={c.src} direction="zoom-in" durationInFrames={dur} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      <AnimatedCaptions cues={BOZKIRIN_UYANISI_CAPTIONS_V2} bottomOffsetRatio={0.035} />

      {/* Anlatım — sayfalar arası sessizlikler zaten ses dosyasına splice edildi */}
      <Audio src={staticFile(NARRATION_SRC)} volume={1} />

      {/* Arka plan müziği — ducking'li */}
      <Audio src={staticFile(MUSIC_SRC)} volume={musicVolume} />

      {/* Ambiyans: açılışta soğuk rüzgar, çiçeklenme bölümünde kuş cıvıltısı */}
      <Sequence from={0} durationInFrames={510}>
        <Audio src={staticFile(`${SFX}/ruzgar-soguk.mp3`)} volume={windVolume} />
      </Sequence>
      <Sequence from={6913} durationInFrames={8553 - 6913}>
        <Loop durationInFrames={601}>
          <Audio src={staticFile(`${SFX}/kus-civiltisi.mp3`)} volume={birdVolume} />
        </Loop>
      </Sequence>

      {/* Nokta SFX */}
      <Sequence from={2554} durationInFrames={160}>
        <Audio src={staticFile(`${SFX}/kanat-cirpma.mp3`)} volume={0.5} />
      </Sequence>
      <Sequence from={GUM_FRAME} durationInFrames={130}>
        <Audio src={staticFile(`${SFX}/davul-gum.mp3`)} volume={0.9} />
      </Sequence>
      <Sequence from={GUM_TRIPLE_FRAME} durationInFrames={250}>
        <Audio src={staticFile(`${SFX}/davul-gum-triple.mp3`)} volume={0.6} />
      </Sequence>
      <Sequence from={9481} durationInFrames={250}>
        <Audio src={staticFile(`${SFX}/at-nal-sesi.mp3`)} volume={0.45} />
      </Sequence>
      <Sequence from={9781} durationInFrames={250}>
        <Audio src={staticFile(`${SFX}/buz-kirilma.mp3`)} volume={0.55} />
      </Sequence>
      <Sequence from={9781} durationInFrames={250}>
        <Audio src={staticFile(`${SFX}/turna-cigligi.mp3`)} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
