import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

/**
 * GemVault Reklam 2 — "Molo Problemi" (6 sahne x 10sn = 60sn @ 24fps)
 *
 * KULLANIM:
 * public/clips/ klasörüne şu dosyaları koy:
 *   ad2-scene-01.mp4  (Molo - prompt çilesi)
 *   ad2-scene-02.mp4  (Molo - inatçı ret)
 *   ad2-scene-03.mp4  (Defne - kolaylık)
 *   ad2-scene-04.mp4  (Defne - bitti bile)
 *   ad2-scene-05.mp4  (Split-screen karşılaştırma — Flow'da tek klip
 *                       olarak üretildi)
 *   ad2-scene-06.mp4  (Logo kapanış + Molo öğreniyor)
 *
 * NOT — SERT KESİM: Sahne 2 → Sahne 3 arasında bilinçli olarak hiçbir
 * geçiş/crossfade YOK. Zıtlığı vurgulamak için ani kesim korunmalı.
 */

const chaosScenes = ["ad2-scene-01.mp4", "ad2-scene-02.mp4"];

const easeScenes = ["ad2-scene-03.mp4", "ad2-scene-04.mp4"];

export const GemVaultAd2: React.FC = () => {
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
          <RawClip src={`clips/${file}`} />
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
          <RawClip src={`clips/${file}`} />
        </Sequence>
      ))}

      {/* BÖLÜM 3a — Sahne 5: Split-screen karşılaştırma (40-50sn) */}
      <Sequence
        from={4 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Split-Screen Karşılaştırma"
      >
        <RawClip src="clips/ad2-scene-05.mp4" />
      </Sequence>

      {/* BÖLÜM 3b — Sahne 6: Logo + esprili CTA (50-60sn) */}
      <Sequence
        from={5 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name="Logo Kapanış"
      >
        <RawClip src="clips/ad2-scene-06.mp4" />
        <LogoWordmark fadeInStart={20} tagline="Molo gibi olma." />
      </Sequence>
    </AbsoluteFill>
  );
};
