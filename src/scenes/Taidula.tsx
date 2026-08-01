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
import { TAIDULA_CAPTIONS } from "../data/taidulaCaptions";
import { TAIDULA_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = TAIDULA_DURATION_FRAMES; // 1110 (~37sn @ 30fps)
const VIDEO_SRC = "videos/taidula-scene.mp4";
const NARRATION_SRC = "audio/taidula_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // Çing Hatun ile aynı — seri tutarlılığı

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
const OUTRO_START = TOTAL_FRAMES - 30; // 1080 — genel fade-out burada başlar
const AMBIENT_FADE_START = OUTRO_START - 30; // 1050 -> 1080 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // Çing Hatun projesindeki ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Taidula" — Bozkır Hatunları serisinin ikinci filmi. Çing Hatun'daki
 * ColorGrade / Caption / ambiyans katmanları aynen reuse edilir (seri
 * tutarlılığı). Anlatım videodan uzun sürdüğü için kapanışta video son
 * karede donar (8 frame'lik crossfade ile yumuşak geçiş) ve anlatım
 * bitene kadar donmuş kare + yavaş zoom devam eder.
 */
export const TaidulaFilm: React.FC = () => {
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

      <CaptionTrack cues={TAIDULA_CAPTIONS} fontSize={44} maxWidthPercent={88} />

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
