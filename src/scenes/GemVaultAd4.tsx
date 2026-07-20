import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { GridReveal } from "../components/GridReveal";
import { LogoWordmark } from "../components/Overlays";
import { sec } from "../theme";

/**
 * GemVault Reklam 4 — "Herkes İçin Bir Gem Var" (~45sn, yatay 16:9)
 *
 * public/clips/: ad4-scene-01.mp4 ... ad4-scene-07.mp4 (Luma, 5sn),
 *                 ad1-scene-09.mp4 (reuse, kapanış)
 * public/audio/{tr,en}/: ad4-scene-01.mp3 ... 07.mp3, ad4-grid.mp3,
 *                         ad4-close.mp3 (YENİ metin — Ad1'inkini
 *                         kopyalama)
 * Metinler: planning/GEMVAULT_REKLAM4_PLAN_V2.md
 *
 * Yapı: Montaj (Defne 6 meslek + Molo mola, 4. sırada) → Grid anı (6
 * Defne paneli aynı anda, Molo hariç) → Kapanış (Ad1 reuse).
 */

const montageScenes = [
  { file: "ad4-scene-01.mp4", audioIndex: "01", duration: 4.5 }, // Geliştirici
  { file: "ad4-scene-02.mp4", audioIndex: "02", duration: 4.5 }, // Sağlık Koçu
  { file: "ad4-scene-03.mp4", audioIndex: "03", duration: 4.5 }, // İçerik Üreticisi
  { file: "ad4-scene-04.mp4", audioIndex: "04", duration: 4.5 }, // Molo
  { file: "ad4-scene-05.mp4", audioIndex: "05", duration: 4.5 }, // Strateji
  { file: "ad4-scene-06.mp4", audioIndex: "06", duration: 4.5 }, // Hukuk/İş
  { file: "ad4-scene-07.mp4", audioIndex: "07", duration: 4.5 }, // Eğitimci
];

const GRID_CLIPS = [
  "clips/ad4-scene-01.mp4",
  "clips/ad4-scene-02.mp4",
  "clips/ad4-scene-03.mp4",
  "clips/ad4-scene-05.mp4",
  "clips/ad4-scene-06.mp4",
  "clips/ad4-scene-07.mp4",
];

const GRID_DURATION = 7;
const CLOSE_DURATION = 6.5;

const MONTAGE_TOTAL = montageScenes.reduce((sum, s) => sum + s.duration, 0);
const GRID_FROM = sec(MONTAGE_TOTAL);
const CLOSE_FROM = sec(MONTAGE_TOTAL + GRID_DURATION);

const TAGLINE = {
  tr: "GemVault Pro",
  en: "GemVault Pro",
};

export const GemVaultAd4: React.FC<{ lang: "tr" | "en" }> = ({ lang }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {montageScenes.map((scene, i) => {
        const from = sec(
          montageScenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0)
        );
        const durationInFrames = sec(scene.duration);
        const isMolo = i === 3;

        return (
          <Sequence
            key={scene.file}
            from={from}
            durationInFrames={durationInFrames}
            name={`Ad4 Sahne ${i + 1}${isMolo ? " (Molo)" : " (Defne)"} (${lang.toUpperCase()})`}
          >
            <RawClip src={`clips/${scene.file}`} volume={0.15} />
            <Audio
              src={staticFile(`audio/${lang}/ad4-scene-${scene.audioIndex}.mp3`)}
              volume={1}
            />
          </Sequence>
        );
      })}

      <Sequence
        from={GRID_FROM}
        durationInFrames={sec(GRID_DURATION)}
        name={`Ad4 Grid (${lang.toUpperCase()})`}
      >
        <GridReveal clips={GRID_CLIPS} />
        <Audio src={staticFile(`audio/${lang}/ad4-grid.mp3`)} volume={1} />
      </Sequence>

      <Sequence
        from={CLOSE_FROM}
        durationInFrames={sec(CLOSE_DURATION)}
        name={`Ad4 Kapanış (${lang.toUpperCase()})`}
      >
        <RawClip src="clips/ad1-scene-09.mp4" volume={0.15} />
        <Audio src={staticFile(`audio/${lang}/ad4-close.mp3`)} volume={1} />
        <LogoWordmark fadeInStart={20} tagline={TAGLINE[lang]} />
      </Sequence>
    </AbsoluteFill>
  );
};
