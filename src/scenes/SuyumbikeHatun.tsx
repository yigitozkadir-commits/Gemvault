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
import { SUYUMBIKE_HATUN_CAPTIONS } from "../data/suyumbikeHatunCaptions";
import { SUYUMBIKE_HATUN_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = SUYUMBIKE_HATUN_DURATION_FRAMES; // 1018 (~33.9sn @ 30fps)
const VIDEO_SRC = "videos/suyumbike-hatun-scene.mp4";
const NARRATION_SRC = "audio/suyumbike_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
const OUTRO_START = TOTAL_FRAMES - 30; // 988 — anlatımın bittiği ana denk gelir
const AMBIENT_FADE_START = OUTRO_START - 30; // 958 -> 988 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // Çing Hatun projesindeki ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Süyümbike Hatun" — Bozkır Hatunları serisinin dördüncü filmi. Çing Hatun /
 * Taidula / Terken Hatun'daki ColorGrade / Caption / ambiyans katmanları
 * aynen reuse edilir. Anlatım iki ayrı ElevenLabs çağrısından oluşur: giriş +
 * direniş normal hızda, "ihanet" sonrası kapanışa kadar ~%7 yavaş (Terken
 * Hatun'un aksine tam çöküş değil, hüzünlü-onurlu bir kapanış). Video 30sn'de
 * bitiyor, anlatım daha uzun sürdüğü için kapanışta son karede donuyor.
 */
export const SuyumbikeHatunFilm: React.FC = () => {
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

  // Belgesel tarzı yavaş, sürekli push-in — freeze karesinde de devam eder.
  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.06], {
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

      <CaptionTrack cues={SUYUMBIKE_HATUN_CAPTIONS} fontSize={44} maxWidthPercent={88} />

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
