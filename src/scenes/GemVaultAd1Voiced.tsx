import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark, CaptionLine } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

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
];

const CTA_TEXT = {
  tr: "Hemen İndir — App Store · Web",
  en: "Download Now — App Store · Web",
};

const OPENING_CAPTION = {
  tr: "Yapay zekayı ustaca kullan.",
  en: "Master AI, effortlessly.",
};

export const GemVaultAd1Voiced: React.FC<{ lang: "tr" | "en" }> = ({
  lang,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => {
        const from = i * SCENE_DURATION_FRAMES;
        const sceneNumber = String(i + 1).padStart(2, "0");
        return (
          <Sequence
            key={scene.file}
            from={from}
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
          </Sequence>
        );
      })}

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
