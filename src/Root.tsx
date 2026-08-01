import React from "react";
import { Composition } from "remotion";
import { GemVaultAd1 } from "./scenes/GemVaultAd1";
import { GemVaultAd2 } from "./scenes/GemVaultAd2";
import { ChingHatunFilm, ChingHatunFilmVertical } from "./scenes/ChingHatun";
import {
  VIDEO_CONFIG,
  SCENE_DURATION_FRAMES,
  CING_HATUN_VIDEO_CONFIG,
  CING_HATUN_DURATION_FRAMES,
  CING_HATUN_VERTICAL_VIDEO_CONFIG,
} from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GemVaultAd1"
        component={GemVaultAd1}
        durationInFrames={9 * SCENE_DURATION_FRAMES} // 90sn
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="GemVaultAd2"
        component={GemVaultAd2}
        durationInFrames={7 * SCENE_DURATION_FRAMES} // 70sn
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatun"
        component={ChingHatunFilm}
        durationInFrames={CING_HATUN_DURATION_FRAMES}
        fps={CING_HATUN_VIDEO_CONFIG.fps}
        width={CING_HATUN_VIDEO_CONFIG.width}
        height={CING_HATUN_VIDEO_CONFIG.height}
      />
      <Composition
        id="ChingHatunVertical"
        component={ChingHatunFilmVertical}
        durationInFrames={CING_HATUN_DURATION_FRAMES}
        fps={CING_HATUN_VERTICAL_VIDEO_CONFIG.fps}
        width={CING_HATUN_VERTICAL_VIDEO_CONFIG.width}
        height={CING_HATUN_VERTICAL_VIDEO_CONFIG.height}
      />
    </>
  );
};
