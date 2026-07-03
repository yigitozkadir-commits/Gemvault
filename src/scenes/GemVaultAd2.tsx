import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RawClip } from "../components/RawClip";
import { SplitScreenCompare } from "../components/SplitScreenCompare";
import { LogoWordmark, CaptionLine } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

/**
 * GemVault Reklam 2 — "Molo Problemi" (7 sahne x 8sn = 56sn @ 24fps)
 *
 * KULLANIM:
 * public/clips/ klasörüne şu dosyaları koy:
 *   ad2-scene-01.mp4  (Molo - prompt çilesi)
 *   ad2-scene-02.mp4  (Molo - manuel arama)
 *   ad2-scene-03.mp4  (Molo - inatçı ret)
 *   ad2-scene-04.mp4  (Defne - kolaylık)
 *   ad2-scene-05.mp4  (Defne - bitti bile)
 *   ad2-scene-06a.mp4 (Molo loop - split screen SOL için, sahne 6)
 *   ad2-scene-06b.mp4 (Defne loop - split screen SAĞ için, sahne 6)
 *   ad2-scene-07.mp4  (Logo + Molo cameo kapanış)
 *
 * NOT: Sahne 6 için Flow'da TEK render'ı da dene. Eğer sonuç iyi
 * çıkarsa, ad2-scene-06a/06b yerine tek bir ad2-scene-06.mp4 kullanıp
 * <RawClip> ile değiştir (aşağıda yorum satırında alternatif hazır).
 *
 * NOT — SERT KESİM: Sahne 3 → Sahne 4 arasında bilinçli olarak hiçbir
 * geçiş/crossfade YOK. Zıtlığı vurgulamak için ani kesim korunmalı.
 */

const chaosScenes = [
  "ad2-scene-01.mp4",
  "ad2-scene-02.mp4",
  "ad2-scene-03.mp4",
];

const easeScenes = ["ad2-scene-04.mp4", "ad2-scene-05.mp4"];

export const GemVaultAd2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* BÖLÜM 1 — Molo'nun Çilesi (Sahne 1-3, 0-24sn) */}
      {chaosScenes.map((file, i) => (
        <Sequence
          key={file}
          from={i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Molo ${i + 1}`}
        >
          <RawClip src={`clips/${file}`} />
        </Sequence>
      ))}

      {/* BÖLÜM 2 — Defne'nin Kolaylığı (Sahne 4-5, 24-40sn) — SERT KESİM */}
      {easeScenes.map((file, i) => (
        <Sequence
          key={file}
          from={3 * SCENE_DURATION_FRAMES + i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Defne ${i + 1}`}
        >
          <RawClip src={`clips/${file}`} />
        </Sequence>
      ))}

      {/* BÖLÜM 3a — Sahne 6: Split-screen karşılaştırma (40-48sn) */}
      <Sequence
        from={5 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Split-Screen Karşılaştırma"
      >
        <SplitScreenCompare
          leftSrc="clips/ad2-scene-06a.mp4"
          rightSrc="clips/ad2-scene-06b.mp4"
        />
        {/*
          ALTERNATİF — eğer Flow'da tek klip olarak split-screen üretimi
          başarılı olduysa, yukarıdaki <SplitScreenCompare> yerine:
          <RawClip src="clips/ad2-scene-06.mp4" />
        */}
      </Sequence>

      {/* BÖLÜM 3b — Sahne 7: Logo + esprili CTA (48-56sn) */}
      <Sequence
        from={6 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Logo Kapanış"
      >
        <RawClip src="clips/ad2-scene-07.mp4" />
        <LogoWordmark fadeInStart={20} tagline="Molo gibi olma." />
      </Sequence>
    </AbsoluteFill>
  );
};
