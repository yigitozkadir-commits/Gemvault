import React from "react";
import { Composition } from "remotion";
import { GemVaultAd1 } from "./scenes/GemVaultAd1";
import { GemVaultAd1Voiced } from "./scenes/GemVaultAd1Voiced";
import { GemVaultAd2 } from "./scenes/GemVaultAd2";
import { GemVaultAd2Voiced } from "./scenes/GemVaultAd2Voiced";
import {
  VIDEO_CONFIG,
  SCENE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
  INTERSTITIAL_DURATION_FRAMES,
} from "./theme";

// Ad1-TR/EN: 9 sahne + 1 ara kart, 9 crossfade sınırı (hepsi geçişli)
const AD1_VOICED_DURATION =
  9 * SCENE_DURATION_FRAMES +
  INTERSTITIAL_DURATION_FRAMES -
  9 * TRANSITION_DURATION_FRAMES;

// Ad2-TR/EN: 6 sahne + 1 ara kart, 6 sınırdan 5'i crossfade (sahne2→3 sert kesim)
const AD2_VOICED_DURATION =
  6 * SCENE_DURATION_FRAMES +
  INTERSTITIAL_DURATION_FRAMES -
  5 * TRANSITION_DURATION_FRAMES;

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

      {/* Türkçe seslendirmeli versiyon (crossfade geçişler + ara kart) */}
      <Composition
        id="GemVaultAd1-TR"
        component={GemVaultAd1Voiced}
        durationInFrames={AD1_VOICED_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "tr" as const }}
      />

      {/* İngilizce seslendirmeli versiyon (crossfade geçişler + ara kart) */}
      <Composition
        id="GemVaultAd1-EN"
        component={GemVaultAd1Voiced}
        durationInFrames={AD1_VOICED_DURATION}
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

      {/* Türkçe seslendirmeli versiyon (crossfade geçişler + ara kart) */}
      <Composition
        id="GemVaultAd2-TR"
        component={GemVaultAd2Voiced}
        durationInFrames={AD2_VOICED_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "tr" as const }}
      />

      {/* İngilizce seslendirmeli versiyon (crossfade geçişler + ara kart) */}
      <Composition
        id="GemVaultAd2-EN"
        component={GemVaultAd2Voiced}
        durationInFrames={AD2_VOICED_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "en" as const }}
      />
    </>
  );
};
