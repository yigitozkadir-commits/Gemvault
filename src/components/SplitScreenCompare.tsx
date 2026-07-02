import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { COLORS, FONTS } from "../theme";

/**
 * Reklam 2 — Sahne 6: Split-screen karşılaştırma.
 * Flow'da tek klip olarak tutarlı üretilemezse (beklenen durum), burada
 * iki ayrı klibi (Molo solda, Defne sağda) yan yana kompoze ediyoruz.
 * Ortada ince altın ayraç çizgisi + üstte opsiyonel etiketler.
 */
export const SplitScreenCompare: React.FC<{
  leftSrc: string; // Molo klibi, örn "clips/ad2-scene-molo-loop.mp4"
  rightSrc: string; // Defne klibi, örn "clips/ad2-scene-defne-loop.mp4"
  leftLabel?: string;
  rightLabel?: string;
}> = ({
  leftSrc,
  rightSrc,
  leftLabel = "GemVault'suz",
  rightLabel = "GemVault ile",
}) => {
  return (
    <AbsoluteFill style={{ flexDirection: "row" }}>
      {/* SOL — Molo */}
      <AbsoluteFill
        style={{
          width: "50%",
          left: 0,
          right: "50%",
          overflow: "hidden",
        }}
      >
        <OffthreadVideo src={staticFile(leftSrc)} volume={0.6} />
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontFamily: FONTS.mono,
            fontSize: 16,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.softGray,
            background: "rgba(6,6,8,0.6)",
            padding: "6px 14px",
            borderRadius: 999,
          }}
        >
          {leftLabel}
        </div>
      </AbsoluteFill>

      {/* SAĞ — Defne */}
      <AbsoluteFill
        style={{
          width: "50%",
          left: "50%",
          right: 0,
          overflow: "hidden",
        }}
      >
        <OffthreadVideo src={staticFile(rightSrc)} volume={0.6} />
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            fontFamily: FONTS.mono,
            fontSize: 16,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.gold,
            background: "rgba(6,6,8,0.6)",
            padding: "6px 14px",
            borderRadius: 999,
          }}
        >
          {rightLabel}
        </div>
      </AbsoluteFill>

      {/* Ortadaki ince altın ayraç */}
      <AbsoluteFill
        style={{
          left: "50%",
          width: 2,
          background: `linear-gradient(180deg, transparent, ${COLORS.gold}, transparent)`,
          boxShadow: `0 0 20px ${COLORS.gold}`,
        }}
      />
    </AbsoluteFill>
  );
};
