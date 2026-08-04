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
import { BEREL_HATUN_CAPTIONS, BEREL_HATUN_FOOTNOTE } from "../data/berelHatunCaptions";
import { BEREL_HATUN_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = BEREL_HATUN_DURATION_FRAMES; // 1239 (~41.3sn @ 30fps)
const SCENE1_SRC = "videos/berel-hatun/scene1-mezar-odasi.mp4";
const SCENE2_SRC = "videos/berel-hatun/scene2-yasli-kadin.mp4";
const SCENE3_SRC = "videos/berel-hatun/scene3-dag-manzarasi.mp4";
const NARRATION_SRC = "audio/berel_hatun_narration.mp3";
const AMBIENT_SRC = "audio/ambient_wind_fire.mp3"; // seri ile aynı — tutarlılık

const CROSSFADE_FRAMES = 12; // ~0.4sn — anlatım dosyasındaki not ("12 frame'lik crossfade")
const SCENE_FRAMES = 300; // her sahne 10sn @ 30fps

// Üç sahne: [0,300) mezar odası, [300,600) yaşlı kadın, [600,900) dağ
// manzarası/altın eserler. Crossfade mantığı Bozkırın Uyanışı v2'deki
// aynı teknik: her sahne (sonuncu hariç) kendi mantıksal süresinin
// ÖTESİNE CROSSFADE_FRAMES kadar uzatılmış mount edilir ve o kuyrukta
// 1'den 0'a soluyarak altındaki (hep opacity 1) bir sonraki sahneyi
// ortaya çıkarır — z-index önceki sahnenin üstte kalmasını sağlar.
const FREEZE_AT = SCENE_FRAMES - 1; // scene3'ün kendi ekseninde son canlı karesi (299)
const SCENE3_LIVE_END = 600 + SCENE_FRAMES; // 900 — global eksende scene3'ün canlı oynadığı son kare

const OUTRO_START = TOTAL_FRAMES - 30; // 1209 — anlatımın bittiği andan kısa süre sonra
const AMBIENT_FADE_START = OUTRO_START - 30;
const AMBIENT_LOOP_FRAMES = 22 * 30;
const AMBIENT_VOLUME = 0.06;
const INTRO_FADE_FRAMES = 15;

const FOOTNOTE_START = SCENE3_LIVE_END; // 900 — dondurma anıyla aynı ana denk gelir
const FOOTNOTE_END = OUTRO_START;

const VIDEO_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

interface SceneDef {
  src: string;
  start: number;
  end: number;
}

const scenes: SceneDef[] = [
  { src: SCENE1_SRC, start: 0, end: 300 },
  { src: SCENE2_SRC, start: 300, end: 600 },
  { src: SCENE3_SRC, start: 600, end: 900 },
];

/**
 * "Berel Hatun" (Kurgan 11, Doğu Kazakistan) — Bozkır Hatunları / Gök Umay
 * serisinin "gizem ailesi" kolundan (Subeşi, Loulan ile aynı epistemik
 * çerçeve): birlikte gömülü kadın ve erkeğin akraba OLMADIĞININ genetik
 * olarak kanıtlanmış olması ana kanca. Üç ayrı 10sn Google Flow klibi
 * (mezar odası → yaşlı kadın portresi → dağ manzarası/altın eserler)
 * 12 kare crossfade ile bağlanıyor. Anlatım (~38.3sn) üç sahnenin toplam
 * süresini (30sn) aştığı için üçüncü sahne kendi son karesinde donuyor.
 * Yüz/kafatası rekonstrüksiyon verisi olmadığı için kapanışta küçük bir
 * bilimsel dürüstlük dipnotu var (bkz. FootnoteCaption).
 */
export const BerelHatunFilm: React.FC = () => {
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

  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.08], {
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
          {scenes.map((scene, index) => {
            const isLast = index === scenes.length - 1;
            const duration = scene.end - scene.start;
            const mountDuration = isLast ? duration : duration + CROSSFADE_FRAMES;
            const opacity = isLast
              ? 1
              : interpolate(frame, [scene.end - CROSSFADE_FRAMES, scene.end], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

            if (opacity <= 0 && frame >= scene.end) return null;
            if (frame < scene.start) return null;

            return (
              <AbsoluteFill
                key={scene.src}
                style={{ opacity, zIndex: scenes.length - index }}
              >
                <Sequence from={scene.start} durationInFrames={mountDuration}>
                  <OffthreadVideo src={staticFile(scene.src)} volume={0} style={VIDEO_STYLE} />
                </Sequence>
              </AbsoluteFill>
            );
          })}

          {/* Scene3 dondurma — canlı oynatım bittiği anda (frame 900) aynı
              son kareyi anlatım bitene kadar tutar. */}
          <Sequence from={SCENE3_LIVE_END} durationInFrames={TOTAL_FRAMES - SCENE3_LIVE_END}>
            <Freeze frame={FREEZE_AT}>
              <OffthreadVideo src={staticFile(SCENE3_SRC)} volume={0} style={VIDEO_STYLE} />
            </Freeze>
          </Sequence>
        </AbsoluteFill>
      </ColorGrade>

      {/* Altyazı/dipnot katmanları sabit yüksek z-index ile — sahnelerin
          crossfade z-index yığınının (en fazla scenes.length) arkasında
          kalıp görünmez olmasınlar diye (bkz. Bozkırın Uyanışı v2'deki
          aynı hatanın kökten düzeltmesi). */}
      <AbsoluteFill style={{ zIndex: 9999 }}>
        <AnimatedCaptions cues={BEREL_HATUN_CAPTIONS} />
        <FootnoteCaption
          text={BEREL_HATUN_FOOTNOTE}
          startFrame={FOOTNOTE_START}
          endFrame={FOOTNOTE_END}
        />
      </AbsoluteFill>

      {/* Anlatım — tek parça, kesintisiz (frame 0'dan başlar) */}
      <Audio src={staticFile(NARRATION_SRC)} volume={1} />

      {/* Bozkır/rüzgar ambiyansı — loop, narration'ın altında, son 30 frame'de fade-out */}
      <Sequence from={0} durationInFrames={OUTRO_START}>
        <Loop durationInFrames={AMBIENT_LOOP_FRAMES}>
          <Audio src={staticFile(AMBIENT_SRC)} volume={ambientVolume} />
        </Loop>
      </Sequence>
    </AbsoluteFill>
  );
};
