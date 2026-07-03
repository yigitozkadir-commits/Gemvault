import React from "react";
import { Composition } from "remotion";
import { GemVaultAd1 } from "./scenes/GemVaultAd1";
import { GemVaultAd1Voiced } from "./scenes/GemVaultAd1Voiced";
import { GemVaultAd2 } from "./scenes/GemVaultAd2";
import { GemVaultAd2Voiced } from "./scenes/GemVaultAd2Voiced";
import { VIDEO_CONFIG, SCENE_DURATION_FRAMES } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Sessiz / orijinal versiyon (yedek olarak tutuluyor) */}
      <Composition
        id="GemVaultAd1"
        component={GemVaultAd1}
        durationInFrames={9 * SCENE_DURATION_FRAMES}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Türkçe seslendirmeli versiyon */}
      <Composition
        id="GemVaultAd1-TR"
        component={GemVaultAd1Voiced}
        durationInFrames={9 * SCENE_DURATION_FRAMES}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "tr" as const }}
      />

      {/* İngilizce seslendirmeli versiyon */}
      <Composition
        id="GemVaultAd1-EN"
        component={GemVaultAd1Voiced}
        durationInFrames={9 * SCENE_DURATION_FRAMES}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "en" as const }}
      />

      <Composition
        id="GemVaultAd2"
        component={GemVaultAd2}
        durationInFrames={6 * SCENE_DURATION_FRAMES}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Türkçe seslendirmeli versiyon */}
      <Composition
        id="GemVaultAd2-TR"
        component={GemVaultAd2Voiced}
        durationInFrames={6 * SCENE_DURATION_FRAMES}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
