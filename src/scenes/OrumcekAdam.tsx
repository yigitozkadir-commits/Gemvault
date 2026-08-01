import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ORUMCEK_ADAM_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = ORUMCEK_ADAM_DURATION_FRAMES; // 880 (~29.3sn @ 30fps)
const VIDEO_SRC = "videos/orumcek-adam-scene.mp4";
const MUSIC_SRC = "audio/spiderman_theme_instrumental.mp3"; // vokal iptalli, 47-76.3sn arasi secildi

// Kaynak klip tek parça 30sn/900 frame, üç perde: Uyanış (0-300), Dönüşüm
// (300-600), Kahramanın Duruşu (600-900). "Sakin" Uyanış perdesi 1.6x
// hızlandırılarak atlanıyor/kısaltılıyor, geri kalan perdeler normal hızda
// akıyor ve kapanışta son karede donarak müziğin doruğuyla birlikte biter.
const ACT1_SOURCE_FRAMES = 300;
const ACT1_SPEED = 1.6;
const ACT1_COMP_FRAMES = Math.round(ACT1_SOURCE_FRAMES / ACT1_SPEED); // 188

const ACT2_START = ACT1_COMP_FRAMES; // 188
const ACT2_FRAMES = 300; // Dönüşüm, normal hız
const ACT2_TRIM_BEFORE = 300;

const ACT3_START = ACT2_START + ACT2_FRAMES; // 488
const ACT3_FRAMES = 300; // Kahramanın Duruşu, normal hız
const ACT3_TRIM_BEFORE = 600;

const FREEZE_START = ACT3_START + ACT3_FRAMES; // 788
const FREEZE_AT_SOURCE_FRAME = 899; // klibin son karesi
const FREEZE_FRAMES = TOTAL_FRAMES - FREEZE_START; // 92 (~3sn) — zafer duruşu asılı kalır

const FADE_IN_FRAMES = 15; // 0.5sn
const FADE_OUT_FRAMES = 30; // 1sn

// ElevenLabs anlatımı bu videoda devre dışı — sadece enstrümantal müzik çalıyor.
const MUSIC_BASE_VOLUME = 0.55;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Örümcek Adam" — Bozkır Hatunları serisinden bağımsız, ayrı bir hobi
 * projesi. Metin overlay yok, seri kapanış imzası yok, ElevenLabs anlatımı
 * devre dışı — tek ses katmanı enstrümantal müzik. Kaynak Flow klibi zaten
 * sinematik renklendirilmiş geldiği için ek bir ColorGrade katmanı
 * uygulanmıyor. Müzik, yüklenen "Spider-Man Movie Theme" dosyasından
 * vokal/merkez kanal iptaliyle (phase-cancellation) enstrümantal hale
 * getirildi ve şarkının en güçlü/ritmik bölümünden (47-76.3sn) 29.3sn'lik
 * bir dilim seçildi. Videonun "sakin" açılış perdesi (Uyanış) 1.6x
 * hızlandırılarak atlanıp aksiyon perdelerine daha hızlı geçiliyor; kapanışta
 * kahraman duruşu son karede donarak müziğin doruğuyla birlikte asılı kalıyor.
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

  const musicVolume = MUSIC_BASE_VOLUME * opacity;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity }}>
      {frame < FREEZE_START ? (
        <>
          {/* Perde 1 — "Uyanış", 1.6x hızlandırılmış (sakin kısım atlanıyor) */}
          <Sequence from={0} durationInFrames={ACT1_COMP_FRAMES}>
            <OffthreadVideo
              src={staticFile(VIDEO_SRC)}
              volume={0}
              playbackRate={ACT1_SPEED}
              style={VIDEO_STYLE}
            />
          </Sequence>

          {/* Perde 2 — "Dönüşüm", normal hız */}
          <Sequence
            from={ACT2_START}
            durationInFrames={ACT2_FRAMES}
            trimBefore={ACT2_TRIM_BEFORE}
          >
            <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
          </Sequence>

          {/* Perde 3 — "Kahramanın Duruşu", normal hız */}
          <Sequence
            from={ACT3_START}
            durationInFrames={ACT3_FRAMES}
            trimBefore={ACT3_TRIM_BEFORE}
          >
            <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
          </Sequence>
        </>
      ) : (
        // Kapanış — son karede donup zafer duruşu asılı kalır. Sequence'e
        // sarmadan doğrudan üst seviyede render ediliyor ki Freeze'in
        // frame prop'u OffthreadVideo'nun KENDİ (trimBefore'suz) zaman
        // eksenine göre yorumlansın — bir Sequence içine alınırsa Freeze
        // yanlış kareye (aktif Sequence'in yerel karesine) kilitleniyor.
        <Freeze frame={FREEZE_AT_SOURCE_FRAME}>
          <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
        </Freeze>
      )}

      {/* ElevenLabs anlatımı devre dışı — sadece müzik çalıyor */}
      <Audio src={staticFile(MUSIC_SRC)} volume={musicVolume} />
    </AbsoluteFill>
  );
};
