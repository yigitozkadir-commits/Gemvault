import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ColorGrade } from "../components/ColorGrade";
import { AnimatedCaptions } from "../components/AnimatedCaptions";
import { FootnoteCaption } from "../components/FootnoteCaption";
import { LOULAN_GUZELI_CAPTIONS, LOULAN_GUZELI_FOOTNOTE } from "../data/loulanGuzeliCaptions";
import { LOULAN_GUZELI_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = LOULAN_GUZELI_DURATION_FRAMES; // 1489 (~49.6sn @ 30fps)
const VIDEO_SRC = "videos/loulan-guzeli-scene.mp4";
const NARRATION_SRC = "audio/loulan_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
// Anlatım 1.5x hızlandırıldıktan sonra (~48.8sn) freeze çok daha kısa
// (~19.7sn donmuş kare) — önceki (73sn/44sn freeze) sürümden belirgin kısa.
const OUTRO_START = TOTAL_FRAMES - 30; // 1459 — anlatımın bittiği ana denk gelir
const AMBIENT_FADE_START = OUTRO_START - 30; // 1429 -> 1459 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // Çing Hatun projesindeki ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

// Son replik ("Kaynaklarıyla birlikte...") 1379-1458 arası konuşuluyor;
// dipnot bu repliğin ortasında belirip kapanış fade'i boyunca ekranda kalıyor.
const FOOTNOTE_START = 1420;
const FOOTNOTE_END = TOTAL_FRAMES;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Loulan Güzeli" (Tiebanhe M1) — Gök Umay serisinin en "akademik/nötr"
 * tonlu filmi. Rapor "Beş Altın Kural"a göre yazıldı: kesinlik iddiası yok,
 * "yaklaşık" ibareleri korundu, milliyet atfı yapılmadı. ColorGrade /
 * ambiyans katmanları seriyle aynı; altyazılar artık paylaşılan
 * <AnimatedCaptions/> component'i ile (gerçek ElevenLabs kelime zamanlaması
 * kullanılarak) gösteriliyor. Kapanışta, rapor kuralı gereği küçük/soluk bir
 * bilimsel dürüstlük dipnotu (<FootnoteCaption/>) beliriyor.
 */
export const LoulanGuzeliFilm: React.FC = () => {
  const frame = useCurrentFrame();

  const introFade = interpolate(frame, [0, INTRO_FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outroFade = interpolate(frame, [OUTRO_START, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = Math.min(introFade, outroFade);

  // Freeze artık orta uzunlukta (~19.7sn) — Taidula/Terken Hatun gibi kısa
  // overhang videolarından biraz daha belirgin bir zoom kullanıyoruz.
  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const liveOpacity = interpolate(
    frame,
    [FREEZE_AT - EASE_FRAMES, FREEZE_AT],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const frozenOpacity = 1 - liveOpacity;

  const ambientVolume = interpolate(
    frame,
    [AMBIENT_FADE_START, OUTRO_START],
    [AMBIENT_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
      <ColorGrade>
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          {liveOpacity > 0 && (
            <AbsoluteFill style={{ opacity: liveOpacity }}>
              <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
            </AbsoluteFill>
          )}
          {frozenOpacity > 0 && (
            <AbsoluteFill style={{ opacity: frozenOpacity }}>
              <Freeze frame={FREEZE_AT}>
                <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
              </Freeze>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </ColorGrade>

      <AnimatedCaptions cues={LOULAN_GUZELI_CAPTIONS} />
      <FootnoteCaption
        text={LOULAN_GUZELI_FOOTNOTE}
        startFrame={FOOTNOTE_START}
        endFrame={FOOTNOTE_END}
      />

      {/* Anlatım — tek parça, kesintisiz (frame 0'dan başlar) */}
      <Audio src={staticFile(NARRATION_SRC)} volume={1} />

      {/* Bozkır/ateş/rüzgar ambiyansı — loop, narration'ın altında, son 30 frame'de fade-out */}
      <Sequence from={0} durationInFrames={OUTRO_START}>
        <Loop durationInFrames={AMBIENT_LOOP_FRAMES}>
          <Audio src={staticFile(AMBIENT_SRC)} volume={ambientVolume} />
        </Loop>
      </Sequence>
    </AbsoluteFill>
  );
};
