import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

/**
 * Video klibi olmayan, sadece marka renkleri/fontlarıyla üretilen ara
 * sahne kartı (örn. sayı vurgusu veya karşıtlık metni). `lines` her biri
 * ayrı bir satırda ortalanmış şekilde render edilir; ilk satır gold,
 * varsa ikinci satır turkuaz renkte vurgulanır.
 */
export const Interstitial: React.FC<{ lines: string[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    from: 0.92,
    to: 1,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgDark,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        {lines.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 500,
              fontSize: i === 0 ? 52 : 40,
              color: i === 0 ? COLORS.gold : COLORS.turquoise,
              letterSpacing: "0.01em",
              textShadow: `0 0 40px ${i === 0 ? COLORS.gold : COLORS.turquoise}44`,
              marginTop: i === 0 ? 0 : 10,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
