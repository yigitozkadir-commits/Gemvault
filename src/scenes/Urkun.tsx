import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AnimatedCaptions } from "../components/AnimatedCaptions";
import { URKUN_CAPTIONS } from "../data/urkunCaptions";
import { URKUN_DURATION_FRAMES } from "../theme";

const TOTAL_FRAMES = URKUN_DURATION_FRAMES; // 3036 (~101.2sn @ 30fps)
const IMG = "images/urkun";
const NARRATION_SRC = "audio/urkun_narration.mp3";

const CROSSFADE_FRAMES = 15;
const INTRO_FADE_FRAMES = 15;
const OUTRO_FADE_FRAMES = 20;

type KenBurns = "zoom-in" | "zoom-out" | "pan-left" | "pan-right";

interface Scene {
  src: string;
  start: number;
  end: number;
  direction: KenBurns;
}

// Sahne sınırları doğrudan anlatımın gerçek kelime zamanlamasından —
// her sahne kendi repliği başladığında ekrana geliyor, görsel/ses hiç
// kaymıyor (bkz. /tmp/urkun/cues.json hesaplaması).
const scenes: Scene[] = [
  { src: `${IMG}/sahne1-acilis-1916.jpg`, start: 0, end: 327, direction: "zoom-in" },
  { src: `${IMG}/sahne2-kararname.jpg`, start: 327, end: 878, direction: "pan-right" },
  { src: `${IMG}/sahne3-goc-kervan.jpg`, start: 878, end: 1262, direction: "zoom-out" },
  { src: `${IMG}/sahne4-tanri-daglari.jpg`, start: 1262, end: 1483, direction: "zoom-in" },
  { src: `${IMG}/sahne5-yuruyus-firtina.jpg`, start: 1483, end: 1701, direction: "pan-left" },
  { src: `${IMG}/sahne6-urkun-mezarlar.jpg`, start: 1701, end: 2099, direction: "zoom-in" },
  { src: `${IMG}/sahne7a-vadiye-donus.jpg`, start: 2099, end: 2431, direction: "zoom-out" },
  { src: `${IMG}/sahne7b-anma-toreni.jpg`, start: 2431, end: 2511, direction: "zoom-in" },
  { src: `${IMG}/sahne8-final-gokumay.jpg`, start: 2511, end: TOTAL_FRAMES, direction: "zoom-in" },
];

const DRIFT_SCALE = 0.06;
const DRIFT_SHIFT = 1.5;

/**
 * Görsel her zaman TAM olarak gösterilir (contain) — hiçbir kare
 * kırpılmaz. Görsellerin çoğunda üst kısımda gömülü başlık metni var
 * (örn. "TANRI DAĞLARI... UMUTTU."); cover ile kırpma bu metinleri
 * keserdi. Yan/üst-alt boşluklar aynı görselin bulanık kopyasıyla
 * dolduruluyor (bkz. StorybookPage.tsx — Bozkırın Uyanışı'ndaki aynı
 * teknik, orada karakter yüzlerinin kırpılmasını önlemişti).
 */
const SceneImage: React.FC<{ src: string; direction: KenBurns; durationInFrames: number }> = ({
  src,
  direction,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  switch (direction) {
    case "zoom-in":
      scale = interpolate(progress, [0, 1], [1, 1 + DRIFT_SCALE]);
      break;
    case "zoom-out":
      scale = interpolate(progress, [0, 1], [1 + DRIFT_SCALE, 1]);
      break;
    case "pan-left":
      scale = 1 + DRIFT_SCALE / 2;
      translateX = interpolate(progress, [0, 1], [DRIFT_SHIFT, -DRIFT_SHIFT]);
      break;
    case "pan-right":
      scale = 1 + DRIFT_SCALE / 2;
      translateX = interpolate(progress, [0, 1], [-DRIFT_SHIFT, DRIFT_SHIFT]);
      break;
  }

  const file = staticFile(src);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#050505" }}>
      <AbsoluteFill>
        <Img
          src={file}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(52px) brightness(0.4) saturate(1.1)",
            transform: "scale(1.15)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={file}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * "1916 Ürkün" — Kırgız halkının Çarlık Rusyası'na karşı ayaklanması ve
 * dağlar üzerinden zorunlu göçünü anlatan anma formatında bir Reels.
 * Bozkır Hatunları serisinden bağımsız — video klip yok, sadece 9 statik
 * görsel (contain + bulanık zemin, hiç kırpılmadan) ve tek parça anlatım.
 * Müzik/SFX bilinçli olarak yok (kullanıcı isteği: "sadece görsel ve
 * seslendirme"). Sahneler arası geçiş, segment z-index yığını + kuyrukta
 * sönme tekniğiyle (bkz. BozkirinUyanisiFilmV2 / BerelHatun) — sahne 7
 * iki görsel kullanıyor (vadiye dönüş → güncel anma töreni).
 */
export const UrkunFilm: React.FC = () => {
  const frame = useCurrentFrame();

  const introFade = interpolate(frame, [0, INTRO_FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outroFade = interpolate(frame, [TOTAL_FRAMES - OUTRO_FADE_FRAMES, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = Math.min(introFade, outroFade);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
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
          <AbsoluteFill key={scene.src} style={{ opacity, zIndex: scenes.length - index }}>
            <Sequence from={scene.start} durationInFrames={mountDuration}>
              <SceneImage src={scene.src} direction={scene.direction} durationInFrames={duration} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      {/* Sabit yüksek z-index — segment katmanının crossfade yığınının
          arkasında kalıp görünmez olmasın diye (bkz. CLAUDE.md §2.1). */}
      <AbsoluteFill style={{ zIndex: 9999 }}>
        <AnimatedCaptions cues={URKUN_CAPTIONS} />
      </AbsoluteFill>

      {/* Anlatım — tek parça, kesintisiz. Müzik/ambiyans yok. */}
      <Audio src={staticFile(NARRATION_SRC)} volume={1} />
    </AbsoluteFill>
  );
};
