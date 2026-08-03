import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Ana AnimatedCaptions'tan bilinçli olarak farklı: küçük, soluk, ekranın
 * üstünde duran bir "dipnot" — bilimsel dürüstlük notu gibi ana anlatıyı
 * bölmeyen ek bilgiler için (bkz. Loulan Güzeli raporu).
 */
export const FootnoteCaption: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
}> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  if (frame < startFrame || frame > endFrame + 10) return null;

  const fadeIn = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [endFrame, endFrame + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut) * 0.7;

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: height * 0.05 }}
    >
      <div
        style={{
          maxWidth: "78%",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 500,
          fontSize: height * 0.022,
          lineHeight: 1.4,
          color: "#FFFFFF",
          opacity,
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
