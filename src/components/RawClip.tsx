import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

/**
 * Flow'dan indirilen ham MP4 klibi oynatır.
 * `src` public/ klasörüne göre relatif yol olmalı, örn: "clips/ad1-scene-01.mp4"
 * staticFile() Remotion'ın public klasöründen doğru path'i çözer.
 */
export const RawClip: React.FC<{
  src: string;
  volume?: number;
}> = ({ src, volume = 1 }) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(src)} volume={volume} />
    </AbsoluteFill>
  );
};
