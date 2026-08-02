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
import { CaptionTrack } from "../components/Captions";
import { UKOK_PRENSESI_CAPTIONS } from "../data/ukokPrensesiCaptions";
import { UKOK_PRENSESI_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = UKOK_PRENSESI_DURATION_FRAMES; // 1710 (57sn @ 30fps)
const VIDEO_SRC = "videos/ukok-prensesi-scene.mp4";
const NARRATION_SRC = "audio/ukok_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
const OUTRO_START = TOTAL_FRAMES - 30; // 1680 — marka kartının bittiği ana denk gelir
const AMBIENT_FADE_START = OUTRO_START - 30; // 1650 -> 1680 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // Çing Hatun projesindeki ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Ukok Prensesi" — Gök Umay serisinin denemesi: Taidula'da kullanılan aynı
 * klip (taht/mühür/tower-çöl split-screen), tamamen farklı bir anlatımla
 * (Altay buz mumyası keşfi) eşleştiriliyor. ColorGrade / Caption / ambiyans
 * katmanları seriyle aynı. Metin çok daha uzun olduğu için narration (~53sn)
 * videodan (30sn) belirgin uzun sürüyor — kapanışta son karede donuyor,
 * anlatım bitince seslendirilmemiş bir marka kartı ("Gök Umay | Avrasya
 * Bozkırının Sessiz Bekçileri") beliriyor, sonra GÖKUMAY kapanış imzasına
 * geçiliyor (bkz. Root.tsx — FilmWithOutro).
 */
export const UkokPrensesiFilm: React.FC = () => {
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

  // Freeze çok uzun sürdüğü için (yaklaşık 27sn) zoom aralığı daha belirgin —
  // "donmuş ama nefes alan kare" hissi tüm süre boyunca sürsün diye.
  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.18], {
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

      <CaptionTrack cues={UKOK_PRENSESI_CAPTIONS} fontSize={44} maxWidthPercent={88} />

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
