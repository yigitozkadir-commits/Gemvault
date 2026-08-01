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
import { SUBESHI_CADILARI_CAPTIONS } from "../data/subeshiCadilariCaptions";
import { SUBESHI_CADILARI_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = SUBESHI_CADILARI_DURATION_FRAMES; // 1080 (36sn @ 30fps)
const VIDEO_SRC = "videos/subeshi-cadilari-scene.mp4";
const NARRATION_SRC = "audio/subeshi_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
const OUTRO_START = TOTAL_FRAMES - 30; // 1050 — anlatımın bittiği ana denk gelir
const AMBIENT_LOOP_FRAMES = 22 * 30; // Çing Hatun projesindeki ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
// Diğer filmlerin aksine ambiyans tam sessizliğe değil, çok düşük bir
// seviyeye (-30dB civarı) iniyor — "rüzgar hâlâ esiyor ama biz duymuyoruz".
const AMBIENT_TAIL_VOLUME = 0.02;
const AMBIENT_FADE_START = OUTRO_START - 30;
const INTRO_FADE_FRAMES = 15;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Subeşi Cadıları" — Bozkır Hatunları serisinin beşinci filmi, ama farklı
 * bir kayıttan: bir hükümdar/güç anlatısı değil, kimliği bilinmeyen üç
 * mumyanın çözülmemiş gizemi. ColorGrade / Caption / ambiyans katmanları
 * seriyle aynı, ama anlatım belirgin şekilde daha yavaş ve alçak (düşük
 * style/yüksek stability), son cümle daha da yavaş — fısıltıya yakın bir
 * kapanış. Video 30sn'de bitiyor, anlatım daha uzun sürdüğü için kapanışta
 * son karede donuyor.
 */
export const SubeshiCadilariFilm: React.FC = () => {
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
    [AMBIENT_VOLUME, AMBIENT_TAIL_VOLUME],
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

      <CaptionTrack cues={SUBESHI_CADILARI_CAPTIONS} fontSize={44} maxWidthPercent={88} />

      {/* Anlatım — tek parça, kesintisiz (frame 0'dan başlar) */}
      <Audio src={staticFile(NARRATION_SRC)} volume={1} />

      {/* Çöl rüzgarı ambiyansı — loop, narration'ın altında; sonda tam sessizliğe değil çok düşük bir seviyeye iner */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <Loop durationInFrames={AMBIENT_LOOP_FRAMES}>
          <Audio src={staticFile(AMBIENT_SRC)} volume={ambientVolume} />
        </Loop>
      </Sequence>
    </AbsoluteFill>
  );
};
