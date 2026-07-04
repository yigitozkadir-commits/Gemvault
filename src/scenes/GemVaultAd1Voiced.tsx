import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { RawClip } from "../components/RawClip";
import { LogoWordmark, CaptionLine } from "../components/Overlays";
import { Interstitial } from "../components/Interstitial";
import {
  SCENE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
  INTERSTITIAL_DURATION_FRAMES,
} from "../theme";

/**
 * GemVault Reklam 1 — Tanıtım, SESLİ VERSİYON (TR/EN destekli)
 *
 * Bu dosya GemVaultAd1.tsx'in ses eklenmiş halidir. Kullanmak için
 * Root.tsx'te GemVaultAd1 yerine (veya ek olarak) bu bileşeni de
 * Composition olarak kaydet — örnek Root.tsx altta.
 *
 * KULLANIM:
 * `lang` prop'u "tr" veya "en" olabilir. Ses dosyalarını şuraya koy:
 *   public/audio/tr/scene-01.mp3 ... scene-09.mp3
 *   public/audio/en/scene-01.mp3 ... scene-09.mp3
 * (Metinler GEMVAULT_AD1_VOICEOVER_TR_EN.md dosyasında hazır — ElevenLabs
 * veya tercih ettiğin TTS ile seslendirip buraya koy.)
 *
 * GEÇİŞLER: Sahneler arası crossfade (`@remotion/transitions`,
 * `TRANSITION_DURATION_FRAMES` kadar) — 4. sahne ile 5. sahne arasına
 * ayrıca bir "735 Gem · 18 Kategori" ara kartı (`Interstitial`) girdi.
 * Toplam süre bu yüzden artık 9×SCENE_DURATION_FRAMES değil, Root.tsx'te
 * ayrıca hesaplanmış (bkz. yorum orada).
 */

const scenes = [
  { file: "ad1-scene-01.mp4", label: null },
  { file: "ad1-scene-02.mp4", label: null },
  { file: "ad1-scene-03.mp4", label: null },
  { file: "ad1-scene-04.mp4", label: null },
  { file: "ad1-scene-05.mp4", label: null },
  { file: "ad1-scene-06.mp4", label: null },
  { file: "ad1-scene-07.mp4", label: null },
  { file: "ad1-scene-08.mp4", label: null },
  { file: "ad1-scene-09.mp4", label: "logo" },
] as const;

const CTA_TEXT = {
  tr: "Hemen İndir — App Store · Web",
  en: "Download Now — App Store · Web",
};

const OPENING_CAPTION = {
  tr: "Yapay zekayı ustaca kullan.",
  en: "Master AI, effortlessly.",
};

const INTERSTITIAL_TEXT = {
  tr: ["735 Gem", "18 Kategori"],
  en: ["735 Gems", "18 Categories"],
};

const crossfade = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_DURATION_FRAMES })}
  />
);

export const GemVaultAd1Voiced: React.FC<{ lang: "tr" | "en" }> = ({
  lang,
}) => {
  const renderScene = (scene: (typeof scenes)[number], i: number) => {
    const sceneNumber = String(i + 1).padStart(2, "0");
    return (
      <TransitionSeries.Sequence
        key={scene.file}
        durationInFrames={SCENE_DURATION_FRAMES}
        name={`Sahne ${i + 1} (${lang.toUpperCase()})`}
      >
        <RawClip src={`clips/${scene.file}`} volume={0.25} />
        {/* Voiceover — orijinal klip sesi kısılıp (volume 0.25)
            üzerine seslendirme bindiriliyor */}
        <Audio
          src={staticFile(`audio/${lang}/scene-${sceneNumber}.mp3`)}
          volume={1}
        />
        {scene.label === "logo" && (
          <>
            <LogoWordmark
              fadeInStart={30}
              tagline={
                lang === "tr"
                  ? "735 Gem · 18 Kategori"
                  : "735 Gems · 18 Categories"
              }
            />
            <CaptionLine
              text={CTA_TEXT[lang]}
              position="bottom"
              fadeInStart={60}
            />
          </>
        )}
      </TransitionSeries.Sequence>
    );
  };

  const firstHalf = scenes.slice(0, 4);
  const secondHalf = scenes.slice(4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {firstHalf.map((scene, i) => (
          <React.Fragment key={scene.file}>
            {i > 0 && crossfade}
            {renderScene(scene, i)}
          </React.Fragment>
        ))}

        {crossfade}
        <TransitionSeries.Sequence
          durationInFrames={INTERSTITIAL_DURATION_FRAMES}
          name={`Ara Kart (${lang.toUpperCase()})`}
        >
          <Interstitial lines={INTERSTITIAL_TEXT[lang]} />
        </TransitionSeries.Sequence>
        {crossfade}

        {secondHalf.map((scene, i) => (
          <React.Fragment key={scene.file}>
            {i > 0 && crossfade}
            {renderScene(scene, i + 4)}
          </React.Fragment>
        ))}
      </TransitionSeries>

      <Sequence from={0} durationInFrames={72}>
        <CaptionLine
          text={OPENING_CAPTION[lang]}
          position="top"
          fadeInStart={10}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
