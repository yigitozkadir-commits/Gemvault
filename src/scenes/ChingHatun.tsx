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
import { CING_HATUN_CAPTIONS } from "../data/chingHatunCaptions";
import { CING_HATUN_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = CING_HATUN_DURATION_FRAMES; // 900 (30sn @ 30fps)
const FREEZE_AT = 884; // son 15 frame bu karede donar (885-900)
const OUTRO_START = 870; // genel fade-out burada başlar
const AMBIENT_LOOP_FRAMES = 22 * 30; // üretilen ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const AMBIENT_FADE_START = OUTRO_START - 30; // 840 -> 870 arası 0'a iner
const INTRO_FADE_FRAMES = 15;

/**
 * "Çing Hatun" — 30sn belgesel klibi. Tek parça Flow görüntüsü
 * (İlk Sahne) üstüne ElevenLabs anlatımı, ambiyans, ortak renk grade'i
 * ve zaman-kodlu alt yazılar bindirilir.
 */
export const ChingHatunFilm: React.FC = () => {
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

  // Belgesel tarzı yavaş, sürekli push-in — kapanışta freeze karesinde de
  // devam ederek "donmuş ama nefes alan kare" hissi verir.
  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          {frame <= FREEZE_AT ? (
            <OffthreadVideo
              src={staticFile("videos/cinghatun-ilk-sahne.mp4")}
              volume={0}
            />
          ) : (
            <Freeze frame={FREEZE_AT}>
              <OffthreadVideo
                src={staticFile("videos/cinghatun-ilk-sahne.mp4")}
                volume={0}
              />
            </Freeze>
          )}
        </AbsoluteFill>
      </ColorGrade>

      <CaptionTrack cues={CING_HATUN_CAPTIONS} />

      {/* Anlatım — tek parça, kesintisiz (frame 0'dan başlar) */}
      <Audio src={staticFile("audio/narration.mp3")} volume={1} />

      {/* Bozkır/ateş/rüzgar ambiyansı — loop, narration'ın altında, son 30 frame'de fade-out */}
      <Sequence from={0} durationInFrames={OUTRO_START}>
        <Loop durationInFrames={AMBIENT_LOOP_FRAMES}>
          <Audio
            src={staticFile("audio/ambient_wind_fire.mp3")}
            volume={ambientVolume}
          />
        </Loop>
      </Sequence>
    </AbsoluteFill>
  );
};
