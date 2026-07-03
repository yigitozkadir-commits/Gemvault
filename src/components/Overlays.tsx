import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

/**
 * Kapanış sahnelerinde kullanılan "GemVault Pro" wordmark + slogan.
 * fadeInStart: kaçıncı frame'de belirmeye başlasın
 */
export const LogoWordmark: React.FC<{
  fadeInStart?: number;
  tagline?: string;
}> = ({ fadeInStart = 0, tagline = "735 Gem · 18 Kategori" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - fadeInStart;

  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame: localFrame,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontWeight: 500,
            fontSize: 64,
            color: COLORS.gold,
            letterSpacing: "0.02em",
            textShadow: `0 0 40px ${COLORS.gold}55`,
          }}
        >
          GemVault <span style={{ fontStyle: "italic" }}>Pro</span>
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: COLORS.softGray,
            marginTop: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Alt yazı / esprili CTA satırı (ör. Reklam 2 kapanışı: "Molo gibi olma.")
 */
export const CaptionLine: React.FC<{
  text: string;
  fadeInStart?: number;
  position?: "bottom" | "top";
}> = ({ text, fadeInStart = 0, position = "bottom" }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - fadeInStart;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(localFrame, [0, 15], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "bottom" ? "flex-end" : "flex-start",
        alignItems: "center",
        paddingBottom: position === "bottom" ? 80 : 0,
        paddingTop: position === "top" ? 80 : 0,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: FONTS.serif,
          fontStyle: "italic",
          fontSize: 32,
          color: COLORS.white,
          background: "rgba(6,6,8,0.55)",
          padding: "10px 28px",
          borderRadius: 999,
          border: `1px solid ${COLORS.gold}55`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
