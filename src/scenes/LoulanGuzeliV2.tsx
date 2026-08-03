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

const TOTAL_FRAMES = LOULAN_GUZELI_V2_DURATION_FRAMES; // 1625 (~54.2sn @ 30fps)
const VIDEO_SRC = "videos/loulan-guzeli-v2-scene.mp4";
const NARRATION_SRC = "audio/loulan_v2_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const FREEZE_AT = 899; // kaynak video 900 frame (30sn) — son karede donar
const EASE_FRAMES = 8; // freeze'e sert değil, crossfade ile yumuşak giriş
// Revize anlatım (~53.4sn) kaynak videodan (30sn) belirgin uzun sürdüğü
// için artık seri standardı (Taidula/Terken Hatun tarzı) overhang freeze
// kullanılıyor — v1'deki KISA anlatım durumundan farklı olarak.
const OUTRO_START = TOTAL_FRAMES - 30; // 1595 — anlatımın bittiği ana denk gelir
const AMBIENT_FADE_START = OUTRO_START - 30; // 1565 -> 1595 arası 0'a iner
const AMBIENT_LOOP_FRAMES = 22 * 30; // seri ile aynı ambiyans klibi ~22sn
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

// Son replik ("Tekstil, bu toplumda...") 1513-1594 arası konuşuluyor;
// dipnot bu repliğin ortasında belirip kapanış fade'i boyunca ekranda kalıyor.
const FOOTNOTE_START = 1560;
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
 * dürüstlük dipnotu var; bu revizyonda kaynak atıfları da eklendi.
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

  // Freeze artık ~24sn sürdüğü için (900 -> 1625) zoom aralığı v1
  // revizyonundakine benzer şekilde biraz daha belirgin.
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
