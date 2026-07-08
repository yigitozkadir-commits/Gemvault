import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { CaptionLine } from "../components/Overlays";
import { sec } from "../theme";

/**
 * GemVault Reklam 3 — VİRAL KESİM (3 sahne, dikey 9:16, ~15sn)
 * Luma'da üretildi, her sahne 5sn hedeflendi.
 *
 * KULLANIM:
 * public/clips/ altına:
 *   ad3v-scene-01.mp4  (Gruba Katıl Ritüeli)
 *   ad3v-scene-02.mp4  (Boşluk)
 *   ad3v-scene-03.mp4  (GemVault Anında)
 * public/audio/{tr,en}/ altına:
 *   ad3v-scene-01.mp3 ... ad3v-scene-03.mp3
 *
 * ÖNEMLİ — SÜRE KONTROLÜ: Aşağıdaki `scenes` dizisindeki `duration`
 * değerleri TAHMİNİ 5sn (120 frame). Luma'dan gelen gerçek klip süresi
 * farklıysa (örn. 4.8sn veya 5.3sn çıkabilir), her klibi
 * `ffprobe -v error -show_entries format=duration clip.mp4` ile ölç ve
 * aşağıdaki `duration` değerlerini o gerçek süreye göre (saniye cinsinden,
 * sec() fonksiyonu otomatik frame'e çevirir) güncelle. Yanlış süre,
 * sahnelerin üst üste binmesine veya aralarında boşluk kalmasına sebep
 * olur.
 */

const scenes = [
  { file: "ad3v-scene-01.mp4", duration: 5 },
  { file: "ad3v-scene-02.mp4", duration: 5 },
  { file: "ad3v-scene-03.mp4", duration: 5 },
];

const CTA_TEXT = {
  tr: "GemVault Pro — Hemen İndir",
  en: "GemVault Pro — Download Now",
};

export const GemVaultAd3Viral: React.FC<{ lang: "tr" | "en" }> = ({
  lang,
}) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => {
        const from = cursor;
        const durationInFrames = sec(scene.duration);
        cursor += durationInFrames;
        const sceneNumber = String(i + 1).padStart(2, "0");
        const isLast = i === scenes.length - 1;

        return (
          <Sequence
            key={scene.file}
            from={from}
            durationInFrames={durationInFrames}
            name={`Viral Sahne ${i + 1} (${lang.toUpperCase()})`}
          >
            <RawClip src={`clips/${scene.file}`} volume={0.2} />
            <Audio
              src={staticFile(`audio/${lang}/ad3v-scene-${sceneNumber}.mp3`)}
              volume={1}
            />
            {isLast && (
              <CaptionLine
                text={CTA_TEXT[lang]}
                position="bottom"
                fadeInStart={Math.round(durationInFrames * 0.4)}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
