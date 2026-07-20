import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { COLORS, FONTS } from "../theme";

/**
 * Reklam 4 — "Grid anı": 6 klibi aynı anda 2x3 panelde gösterir.
 * "Bir kişi, sınırsız yetkinlik" mesajını görsel olarak taşıyan sahne.
 * Her panel kendi videosunu baştan, aynı anda, sessizce (volume 0)
 * oynatır — ses tek bir ortak voiceover'dan geliyor (bu bileşenin
 * DIŞINDA, kompozisyonda <Audio> ile ekleniyor).
 */
export const GridReveal: React.FC<{
  clips: string[];
  labels?: string[];
}> = ({ clips, labels }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDark }}>
      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 4,
          padding: 4,
        }}
      >
        {clips.map((src, i) => (
          <div
            key={src}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 6,
              border: `1px solid ${COLORS.gold}44`,
            }}
          >
            <OffthreadVideo
              src={staticFile(src)}
              volume={0}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {labels?.[i] && (
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  left: 6,
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: COLORS.white,
                  background: "rgba(6,6,8,0.55)",
                  padding: "3px 8px",
                  borderRadius: 999,
                }}
              >
                {labels[i]}
              </div>
            )}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
