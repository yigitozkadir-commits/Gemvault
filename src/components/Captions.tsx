import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../theme";
import type { CaptionCue } from "../data/chingHatunCaptions";

const FADE_FRAMES = 6;

/**
 * ElevenLabs word-level alignment'ından türetilen frame aralıklarına göre
 * ekranın alt üçte birinde alt yazı gösterir (6 frame fade-in/out).
 */
export const CaptionTrack: React.FC<{
  cues: CaptionCue[];
  fontSize?: number;
  maxWidthPercent?: number;
}> = ({ cues, fontSize = 38, maxWidthPercent = 76 }) => {
  const frame = useCurrentFrame();
  const active = cues.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame + FADE_FRAMES
  );

  if (!active) {
    return null;
  }

  const localIn = frame - active.startFrame;
  const localOut = frame - active.endFrame;

  const fadeIn = interpolate(localIn, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localOut, [0, FADE_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 92 }}
    >
      <div
        style={{
          opacity,
          maxWidth: `${maxWidthPercent}%`,
          textAlign: "center",
          fontFamily: FONTS.serif,
          fontWeight: 500,
          fontSize,
          lineHeight: 1.35,
          color: "#f5f2ea",
          textShadow:
            "0 2px 10px rgba(0,0,0,0.85), 0 0 18px rgba(0,0,0,0.5)",
          WebkitTextStroke: "0.6px rgba(0,0,0,0.35)",
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
