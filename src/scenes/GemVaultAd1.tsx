import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark, CaptionLine } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

/**
 * GemVault Reklam 1 — Tanıtım (9 sahne x 8sn = 72sn @ 24fps = 1728 frame)
 *
 * KULLANIM:
 * Flow'dan indirdiğin her klibi public/clips/ klasörüne şu isimlerle koy:
 *   ad1-scene-01.mp4 ... ad1-scene-09.mp4
 * İsimler farklıysa, aşağıdaki `src` alanlarını güncelle.
 *
 * Klip süreleri Flow'dan tam 8sn gelmeyebilir (bazen 7.x sn olabilir) —
 * gerçek render sonrası her klibin süresini kontrol edip
 * SCENE_DURATION_FRAMES yerine gerçek süreleri gir.
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
  { file: "ad1-scene-09.mp4", label: "logo" }, // kapanış — logo overlay burada
];

export const GemVaultAd1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => {
        const from = i * SCENE_DURATION_FRAMES;
        return (
          <Sequence
            key={scene.file}
            from={from}
            durationInFrames={SCENE_DURATION_FRAMES}
            name={`Sahne ${i + 1}`}
          >
            <RawClip src={`clips/${scene.file}`} />
            {scene.label === "logo" && (
              <>
                <LogoWordmark fadeInStart={30} />
              </>
            )}
          </Sequence>
        );
      })}

      {/* Genel açılış marka etiketi — ilk 3 saniye, sol üst köşe (opsiyonel) */}
      <Sequence from={0} durationInFrames={72}>
        <CaptionLine
          text="Yapay zekayı ustaca kullan."
          position="top"
          fadeInStart={10}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
