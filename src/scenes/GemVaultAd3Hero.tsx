import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark } from "../components/Overlays";
import { sec } from "../theme";

/**
 * GemVault Reklam 3 — HERO KESİM (8 sahne, yatay 16:9, ~70sn)
 * H1-H3 Luma'da (10sn), H5 Flow'da (8sn), H4/H6/H7/H8 Reklam 1'den
 * REUSE ediliyor (8sn, video dosyası zaten var — yeniden üretme).
 *
 * KULLANIM — VİDEO (public/clips/):
 *   ad3h-scene-01.mp4  (Gruba Katıl)              — YENİ, Luma
 *   ad3h-scene-02.mp4  (Hayal Kırıklığı)           — YENİ, Luma
 *   ad3h-scene-03.mp4  (Kilitli Kapı Metaforu)     — YENİ, Luma
 *   ad1-scene-03.mp4   (Kasa Açılışı)              — REUSE, zaten var
 *   ad3h-scene-05.mp4  (AI Gem Üretici, Defne)     — YENİ, Flow
 *   ad1-scene-08.mp4   (Birlikte Zafer/Güven Anı)  — REUSE, zaten var
 *   ad1-scene-04.mp4   (5 Gem Beliriyor/Bolluk)    — REUSE, zaten var
 *   ad1-scene-09.mp4   (Logo Kapanışı)             — REUSE, zaten var
 *
 * KULLANIM — SES (public/audio/{tr,en}/):
 *   ad3h-scene-01.mp3 ... ad3h-scene-08.mp3  — HEPSİ YENİ.
 *   REUSE edilen sahnelerin bile (04, 06, 07, 08) sesi Reklam 1'den
 *   FARKLI — Reklam 3'ün kendi metni var (GEMVAULT_TUM_SESLER_ICTEN_V3.md
 *   dosyasındaki "REKLAM 3 — HERO KESİM" bölümü). Ad1'in ses dosyalarını
 *   buraya kopyalama, video reuse ediliyor ama ses YENİ üretilmeli.
 *
 * ÖNEMLİ — SÜRE KONTROLÜ: `duration` değerleri tahmini (H1-H3: 10sn,
 * H5: 8sn, reuse sahneler: Ad1'de gerçekte kaç saniye çıktıysa o kadar
 * — muhtemelen 8sn ama garanti değil). Her klibi ffprobe ile ölçüp bu
 * dizideki değerleri gerçek sürelere göre güncelle.
 */

const scenes = [
  { file: "ad3h-scene-01.mp4", audioIndex: "01", duration: 10, reused: false },
  { file: "ad3h-scene-02.mp4", audioIndex: "02", duration: 10, reused: false },
  { file: "ad3h-scene-03.mp4", audioIndex: "03", duration: 10, reused: false },
  { file: "ad1-scene-03.mp4", audioIndex: "04", duration: 8, reused: true },
  { file: "ad3h-scene-05.mp4", audioIndex: "05", duration: 8, reused: false },
  { file: "ad1-scene-08.mp4", audioIndex: "06", duration: 8, reused: true },
  { file: "ad1-scene-04.mp4", audioIndex: "07", duration: 8, reused: true },
  { file: "ad1-scene-09.mp4", audioIndex: "08", duration: 8, reused: true },
];

const TAGLINE = {
  tr: "Bu daha başlangıç",
  en: "This is just the beginning",
};

export const GemVaultAd3Hero: React.FC<{ lang: "tr" | "en" }> = ({
  lang,
}) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => {
        const from = cursor;
        const durationInFrames = sec(scene.duration);
        cursor += durationInFrames;
        const isLast = i === scenes.length - 1;

        return (
          <Sequence
            key={`${scene.file}-${i}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Hero Sahne ${i + 1}${scene.reused ? " (REUSE)" : ""} (${lang.toUpperCase()})`}
          >
            <RawClip src={`clips/${scene.file}`} volume={0.2} />
            <Audio
              src={staticFile(
                `audio/${lang}/ad3h-scene-${scene.audioIndex}.mp3`
              )}
              volume={1}
            />
            {isLast && (
              <LogoWordmark
                fadeInStart={Math.round(durationInFrames * 0.3)}
                tagline={TAGLINE[lang]}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
