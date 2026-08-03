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
import { LOULAN_GUZELI_V2_CAPTIONS, LOULAN_GUZELI_V2_FOOTNOTE } from "../data/loulanGuzeliV2Captions";
import { LOULAN_GUZELI_V2_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = LOULAN_GUZELI_V2_DURATION_FRAMES; // 1769 (~59sn @ 30fps)
const VIDEO_SRC = "videos/loulan-guzeli-v2-scene.mp4";
const V1_VIDEO_SRC = "videos/loulan-guzeli-scene.mp4"; // v1'in mezar sahnesi — kapanışta ödünç alınıyor
const NARRATION_SRC = "audio/loulan_v2_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const EASE_FRAMES = 8; // her geçişte sert değil, crossfade ile yumuşak

// v2'nin kendi klibi 900 frame (30sn) sürüyor. Kapanışta sadece onun son
// karesinde donmak yerine — kullanıcı isteği üzerine — v1'in klibine geçip
// (elini bırakmış kumaşı/sepeti gösteren aynı vaha) onun kendi son karesinde
// (mezar sahnesi) doniyoruz; iki filmi birbirine bağlayan bir kapanış.
const V2_LIVE_END = 899; // v2 klibinin son canlı karesi
const V1_INSERT_MOUNT_FROM = V2_LIVE_END - EASE_FRAMES; // 891 — crossfade v2->v1 burada başlar
const V1_INSERT_TRIM_BEFORE = 642; // v1 klibinin kendi zaman ekseninde başlangıç noktası
const V1_INSERT_DURATION = 899 - V1_INSERT_TRIM_BEFORE; // 257 — v1'in kendi son karesine (899) kadar oynar
const V1_LIVE_END = V1_INSERT_MOUNT_FROM + V1_INSERT_DURATION; // 1148
const V1_FREEZE_AT = 899; // v1 klibinin kendi son karesi (mezar reveal) — burada donar

const OUTRO_START = TOTAL_FRAMES - 30; // 1739 — anlatımın bittiği ana denk gelir
const AMBIENT_FADE_START = OUTRO_START - 30; // 1709 -> 1739 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // seri ile aynı ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

// Son replik ("Tekstil, bu toplumda...") 1650-1738 arası konuşuluyor;
// dipnot bu repliğin ortasında belirip, artık v1'in mezar sahnesi üzerinde,
// kapanış fade'i boyunca ekranda kalıyor.
const FOOTNOTE_START = 1700;
const FOOTNOTE_END = TOTAL_FRAMES;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * "Loulan Güzeli v2" ("Elleriyle Bıraktıkları") — v1'in "kimlik gizemi"
 * açısından farklı olarak, onun elleriyle bıraktığı somut izlere (onarılmış
 * kumaş, sepet, tarak) odaklanan daha sıcak bir bakış açısı. Script revize
 * edildi: artık yün/dokuma teknolojisinin Yakın Doğu kökenine ve Avrasya'ya
 * yayılımına (Shishlina 2021, Wagner 2022) odaklanıyor — somut arkeolojik
 * kanıta dayalı bir "tekstil teknolojisi" anlatısı. Aynı "Beş Altın Kural"
 * epistemik sınırları geçerli. Kapanışta, v1'deki gibi küçük/soluk bilimsel
 * dürüstlük dipnotu var; bu revizyonda kaynak atıfları da eklendi. Kapanış
 * sahnesi artık v1'in mezar sahnesine geçip onun üzerinde donarak, iki filmi
 * birbirine bağlıyor.
 */
export const LoulanGuzeliV2Film: React.FC = () => {
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

  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const v2LiveOpacity = interpolate(
    frame,
    [V1_INSERT_MOUNT_FROM, V2_LIVE_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const v1LiveOpacity = Math.min(
    interpolate(frame, [V1_INSERT_MOUNT_FROM, V1_INSERT_MOUNT_FROM + EASE_FRAMES], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [V1_LIVE_END - EASE_FRAMES, V1_LIVE_END], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const v1FrozenOpacity = interpolate(
    frame,
    [V1_LIVE_END - EASE_FRAMES, V1_LIVE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
          {v2LiveOpacity > 0 && (
            <AbsoluteFill style={{ opacity: v2LiveOpacity }}>
              <OffthreadVideo src={staticFile(VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
            </AbsoluteFill>
          )}
          {v1LiveOpacity > 0 && (
            <AbsoluteFill style={{ opacity: v1LiveOpacity }}>
              <Sequence
                from={V1_INSERT_MOUNT_FROM}
                durationInFrames={V1_INSERT_DURATION}
                trimBefore={V1_INSERT_TRIM_BEFORE}
              >
                <OffthreadVideo src={staticFile(V1_VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
              </Sequence>
            </AbsoluteFill>
          )}
          {v1FrozenOpacity > 0 && (
            <AbsoluteFill style={{ opacity: v1FrozenOpacity }}>
              {/* Freeze, Sequence'e sarılmadan doğrudan render edilir — aksi halde
                  frame prop'u trimBefore'lu yerel eksene göre yorumlanıp yanlış
                  kareye kilitlenir (bkz. OrumcekAdam.tsx'teki aynı not). */}
              <Freeze frame={V1_FREEZE_AT}>
                <OffthreadVideo src={staticFile(V1_VIDEO_SRC)} volume={0} style={VIDEO_STYLE} />
              </Freeze>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </ColorGrade>

      <AnimatedCaptions cues={LOULAN_GUZELI_V2_CAPTIONS} />
      <FootnoteCaption
        text={LOULAN_GUZELI_V2_FOOTNOTE}
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
