import React from "react";
import { Composition } from "remotion";
import { GemVaultAd1 } from "./scenes/GemVaultAd1";
import { GemVaultAd1Voiced } from "./scenes/GemVaultAd1Voiced";
import { GemVaultAd2 } from "./scenes/GemVaultAd2";
import { GemVaultAd3Viral } from "./scenes/GemVaultAd3Viral";
import { GemVaultAd3Hero } from "./scenes/GemVaultAd3Hero";
import { GemVaultAd4 } from "./scenes/GemVaultAd4";
import {
  VIDEO_CONFIG,
  VIDEO_CONFIG_VERTICAL,
  SCENE_DURATION_FRAMES,
  sec,
} from "./theme";

// Ad3 Viral: 3 sahne x 5sn = 15sn
const AD3_VIRAL_DURATION = sec(5 * 3);
// Ad3 Hero: 10+10+10+8+8+8+8+8 = 70sn
const AD3_HERO_DURATION = sec(10 + 10 + 10 + 8 + 8 + 8 + 8 + 8);
// Ad4: montaj (7x4.5sn=31.5sn) + grid (7sn) + kapanış (6.5sn) = 45sn
const AD4_DURATION = sec(31.5 + 7 + 6.5);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Sessiz / orijinal versiyon (yedek olarak tutuluyor) */}
      <Composition
        id="GemVaultAd1"
        component={GemVaultAd1}
        durationInFrames={9 * SCENE_DURATION_FRAMES} // 90sn
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
        durationInFrames={7 * SCENE_DURATION_FRAMES} // 70sn
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Reklam 3 — Viral kesim (dikey 9:16, 15sn) */}
      <Composition
        id="GemVaultAd3Viral-TR"
        component={GemVaultAd3Viral}
        durationInFrames={AD3_VIRAL_DURATION}
        fps={VIDEO_CONFIG_VERTICAL.fps}
        width={VIDEO_CONFIG_VERTICAL.width}
        height={VIDEO_CONFIG_VERTICAL.height}
        defaultProps={{ lang: "tr" as const }}
      />
      <Composition
        id="GemVaultAd3Viral-EN"
        component={GemVaultAd3Viral}
        durationInFrames={AD3_VIRAL_DURATION}
        fps={VIDEO_CONFIG_VERTICAL.fps}
        width={VIDEO_CONFIG_VERTICAL.width}
        height={VIDEO_CONFIG_VERTICAL.height}
        defaultProps={{ lang: "en" as const }}
      />

      {/* Reklam 3 — Hero kesim (yatay 16:9, ~70sn) */}
      <Composition
        id="GemVaultAd3Hero-TR"
        component={GemVaultAd3Hero}
        durationInFrames={AD3_HERO_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "tr" as const }}
      />
      <Composition
        id="GemVaultAd3Hero-EN"
        component={GemVaultAd3Hero}
        durationInFrames={AD3_HERO_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "en" as const }}
      />

      {/* Reklam 4 — Sosyal Kanıt montajı (yatay 16:9, ~51sn) */}
      <Composition
        id="GemVaultAd4-TR"
        component={GemVaultAd4}
        durationInFrames={AD4_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "tr" as const }}
      />
      <Composition
        id="GemVaultAd4-EN"
        component={GemVaultAd4}
        durationInFrames={AD4_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{ lang: "en" as const }}
      />
    </>
  );
};
