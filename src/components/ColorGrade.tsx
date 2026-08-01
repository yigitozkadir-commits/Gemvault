import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Çing Hatun filmindeki tüm görüntülerin paylaştığı ortak renk/doku katmanı:
 * sıcak ton + kontrast, vinyet ve ince film grain. Tek yerden değiştirilebilsin
 * diye tüm sahneler bu wrapper'ın içinden geçer.
 */
export const ColorGrade: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ filter: "contrast(1.1) saturate(1.08) sepia(0.12)" }}
      >
        {children}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,180,90,0.07), rgba(0,0,0,0) 60%)",
          mixBlendMode: "overlay",
        }}
      />

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 220px 90px rgba(0,0,0,0.55)",
        }}
      />

      <AbsoluteFill style={{ opacity: 0.04, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="chFilmGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={2}
              seed={frame % 5}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#chFilmGrain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
