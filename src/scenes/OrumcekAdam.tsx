import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ORUMCEK_ADAM_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = ORUMCEK_ADAM_DURATION_FRAMES; // 900 (30sn @ 30fps)
const VIDEO_SRC = "videos/orumcek-adam-scene.mp4";

// Tek parça 30sn'lik Flow klibi içinde üç perde: Uyanış (0-10sn),
// Dönüşüm (10-20sn), Kahramanın Duruşu (20-30sn). Her perdeye kendi
// ElevenLabs replikleri bu sınırlarda başlıyor.
const SCENE1_START = 0;
const SCENE2_START = 300; // 10sn
const SCENE3_START = 600; // 20sn

const FADE_IN_FRAMES = 15; // 0.5sn
const FADE_OUT_FRAMES = 30; // 1sn

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Örümcek Adam" — Bozkır Hatunları serisinden bağımsız, ayrı bir hobi
 * projesi. Metin overlay yok, seri kapanış imzası yok. Kaynak Flow klibi
 * zaten sinematik renklendirilmiş geldiği için ek bir ColorGrade katmanı
 * uygulanmıyor. Arka plan müziği (background_music.mp3) henüz sağlanmadı;
 * geldiğinde ducking mantığıyla (narration sırasında kısılıp aralarda
 * yükselen) eklenecek — bkz. TODO.
 */
export const OrumcekAdamFilm: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, FADE_IN_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity }}>
      <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />

      {/* Parça 1 — "Uyanış" (fısıltı → hafif güçlenme) */}
      <Sequence from={SCENE1_START}>
        <Audio src={staticFile("audio/narration1.mp3")} volume={1} />
      </Sequence>

      {/* Parça 2 — "Dönüşüm" (enerjik, kararlı) */}
      <Sequence from={SCENE2_START}>
        <Audio src={staticFile("audio/narration2.mp3")} volume={1} />
      </Sequence>

      {/* Parça 3 — "Kahramanın Duruşu" (ağırlıklı, zafer dolu kapanış) */}
      <Sequence from={SCENE3_START}>
        <Audio src={staticFile("audio/narration3.mp3")} volume={1} />
      </Sequence>

      {/* TODO: background_music.mp3 sağlandığında buraya eklenecek —
          baştan sona ~%20-25 volume, narration'lar sırasında ~%10'a
          ducking, 0.5sn fade-in / 1sn fade-out. */}
    </AbsoluteFill>
  );
};
