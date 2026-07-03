import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

/**
 * GemVault Reklam 2 — "Molo Problemi", SESLİ VERSİYON (TR)
 *
 * Bu dosya GemVaultAd2.tsx'in ses eklenmiş halidir.
 *
 * KULLANIM:
 * Ses dosyalarını şuraya koy (Ad1'in scene-XX.mp3 isimleriyle
 * çakışmasın diye `ad2-` önekiyle):
 *   public/audio/tr/ad2-scene-01.mp3 ... ad2-scene-04.mp3
 *   public/audio/tr/ad2-scene-05a.mp3, ad2-scene-05b.mp3  (split-screen —
 *     iki farklı ses karakteri art arda, kontrastı vurgulamak için)
 *   public/audio/tr/ad2-scene-06.mp3
 *
 * NOT — SERT KESİM: Sahne 2 → Sahne 3 arasında bilinçli olarak hiçbir
 * geçiş/crossfade YOK.
 */

const chaosScenes = ["ad2-scene-01.mp4", "ad2-scene-02.mp4"];
const easeScenes = ["ad2-scene-03.mp4", "ad2-scene-04.mp4"];

const chaosAudio = ["ad2-scene-01.mp3", "ad2-scene-02.mp3"];
const easeAudio = ["ad2-scene-03.mp3", "ad2-scene-04.mp3"];

export const GemVaultAd2Voiced: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* BÖLÜM 1 — Molo'nun Çilesi (Sahne 1-2, 0-20sn) */}
      {chaosScenes.map((file, i) => (
        <Sequence
          key={file}
          from={i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Molo ${i + 1}`}
        >
          <RawClip src={`clips/${file}`} volume={0.25} />
          <Audio src={staticFile(`audio/tr/${chaosAudio[i]}`)} volume={1} />
        </Sequence>
      ))}

      {/* BÖLÜM 2 — Defne'nin Kolaylığı (Sahne 3-4, 20-40sn) — SERT KESİM */}
      {easeScenes.map((file, i) => (
        <Sequence
          key={file}
          from={2 * SCENE_DURATION_FRAMES + i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Defne ${i + 1}`}
        >
          <RawClip src={`clips/${file}`} volume={0.25} />
          <Audio src={staticFile(`audio/tr/${easeAudio[i]}`)} volume={1} />
        </Sequence>
      ))}

      {/* BÖLÜM 3a — Sahne 5: Split-screen karşılaştırma (40-50sn) —
          iki ses satırı art arda: Cavit (enerjik, Molo tarafı) sonra
          İrem (otoriter, Defne tarafı) — tonlama kontrastı için */}
      <Sequence
        from={4 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Split-Screen Karşılaştırma"
      >
        <RawClip src="clips/ad2-scene-05.mp4" volume={0.25} />
        <Sequence from={15} durationInFrames={60}>
          <Audio src={staticFile("audio/tr/ad2-scene-05a.mp3")} volume={1} />
        </Sequence>
        <Sequence from={85} durationInFrames={40}>
          <Audio src={staticFile("audio/tr/ad2-scene-05b.mp3")} volume={1} />
        </Sequence>
      </Sequence>

      {/* BÖLÜM 3b — Sahne 6: Logo + esprili CTA (50-60sn) */}
      <Sequence
        from={5 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Logo Kapanış"
      >
        <RawClip src="clips/ad2-scene-06.mp4" volume={0.25} />
        <Audio src={staticFile("audio/tr/ad2-scene-06.mp3")} volume={1} />
        <LogoWordmark fadeInStart={20} tagline="Molo gibi olma." />
      </Sequence>
    </AbsoluteFill>
  );
};
