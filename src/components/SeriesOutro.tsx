import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const OUTRO_PLAYBACK_RATE = 1.5;
const OUTRO_SOURCE_SECONDS = 8; // ham GÖKUMAY amblemi klibi
const OUTRO_FPS = 30;

// 8sn kaynak / 1.5x hız = ~5.33sn — tüm seri kompozisyonlarının sonuna eklenir.
export const SERIES_OUTRO_FRAMES = Math.round(
  (OUTRO_SOURCE_SECONDS / OUTRO_PLAYBACK_RATE) * OUTRO_FPS
);

const FADE_FRAMES = 10;
// Klibin kendi zemin tonuna yakın, hafif vinyetli krem-beyaz — dikey
// formatta object-fit:contain ile oluşan üst/alt bantlarla kaynaşsın diye.
const BACKGROUND = "#efeeE8";

/**
 * Seri kapanış imzası — "GÖKUMAY" amblemi, 1.5x hızlandırılmış, siyahtan
 * beyaza yumuşak geçişle açılır. Her filmin kendi fade-to-black'inden hemen
 * sonra sequence'e alınır; bu component'in kendi fade-in'i o siyahla kaynaşır.
 */
export const SeriesOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND, opacity: fadeIn }}>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <OffthreadVideo
          src={staticFile("videos/gokumay-outro.mp4")}
          playbackRate={OUTRO_PLAYBACK_RATE}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
