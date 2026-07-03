import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { RawClip } from "../components/RawClip";
import { LogoWordmark } from "../components/Overlays";
import { SCENE_DURATION_FRAMES } from "../theme";

/**
 * GemVault Reklam 2 — "Molo Problemi", SESLİ VERSİYON (TR/EN)
 *
 * Bu dosya GemVaultAd2.tsx'in ses eklenmiş halidir.
 *
 * KULLANIM:
 * Ses dosyalarını şuraya koy (Ad1'in scene-XX.mp3 isimleriyle
 * çakışmasın diye `ad2-` önekiyle):
 *   public/audio/{lang}/ad2-scene-01.mp3 ... ad2-scene-04.mp3
 *   public/audio/{lang}/ad2-scene-05a.mp3, ad2-scene-05b.mp3  (split-screen)
 *   public/audio/{lang}/ad2-scene-06a.mp3, ad2-scene-06b.mp3  (kapanış)
 *
 * NOT: EN sahne 1 (Molo) satırı orijinalde 12sn'yi aşıyordu (10sn'lik
 * sahneden uzun) — atempo=1.25 ile hafif hızlandırılıp önceden
 * işlenmiş dosya kullanılıyor (perde/pitch korunuyor, sadece tempo).
 * Sahne 5/6'daki çift replik zamanlaması dile göre değişiyor çünkü
 * EN repliklerin bazıları TR'den belirgin şekilde uzun.
 *
 * NOT — SERT KESİM: Sahne 2 → Sahne 3 arasında bilinçli olarak hiçbir
 * geçiş/crossfade YOK.
 */

const chaosScenes = ["ad2-scene-01.mp4", "ad2-scene-02.mp4"];
const easeScenes = ["ad2-scene-03.mp4", "ad2-scene-04.mp4"];

const chaosAudio = ["ad2-scene-01.mp3", "ad2-scene-02.mp3"];
const easeAudio = ["ad2-scene-03.mp3", "ad2-scene-04.mp3"];

const TAGLINE = {
  tr: "Molo gibi olma.",
  en: "Don't be a Molo.",
};

// Sahne 5/6 çift replik zamanlaması — dile göre (EN replikleri daha uzun)
const DUAL_TIMING = {
  tr: {
    scene5: { aFrom: 15, aDur: 60, bFrom: 85, bDur: 40 },
    scene6: { aFrom: 15, aDur: 65, bFrom: 85, bDur: 115 },
  },
  en: {
    scene5: { aFrom: 5, aDur: 65, bFrom: 75, bDur: 80 },
    scene6: { aFrom: 2, aDur: 108, bFrom: 115, bDur: 121 },
  },
};

export const GemVaultAd2Voiced: React.FC<{ lang: "tr" | "en" }> = ({
  lang,
}) => {
  const t = DUAL_TIMING[lang];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* BÖLÜM 1 — Molo'nun Çilesi (Sahne 1-2, 0-20sn) */}
      {chaosScenes.map((file, i) => (
        <Sequence
          key={file}
          from={i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Molo ${i + 1} (${lang.toUpperCase()})`}
        >
          <RawClip src={`clips/${file}`} volume={0.25} />
          <Audio
            src={staticFile(`audio/${lang}/${chaosAudio[i]}`)}
            volume={1}
          />
        </Sequence>
      ))}

      {/* BÖLÜM 2 — Defne'nin Kolaylığı (Sahne 3-4, 20-40sn) — SERT KESİM */}
      {easeScenes.map((file, i) => (
        <Sequence
          key={file}
          from={2 * SCENE_DURATION_FRAMES + i * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
          name={`Defne ${i + 1} (${lang.toUpperCase()})`}
        >
          <RawClip src={`clips/${file}`} volume={0.25} />
          <Audio
            src={staticFile(`audio/${lang}/${easeAudio[i]}`)}
            volume={1}
          />
        </Sequence>
      ))}

      {/* BÖLÜM 3a — Sahne 5: Split-screen karşılaştırma (40-50sn) —
          iki ses satırı art arda: Molo tarafı sonra Defne tarafı */}
      <Sequence
        from={4 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name={`Split-Screen Karşılaştırma (${lang.toUpperCase()})`}
      >
        <RawClip src="clips/ad2-scene-05.mp4" volume={0.25} />
        <Sequence from={t.scene5.aFrom} durationInFrames={t.scene5.aDur}>
          <Audio
            src={staticFile(`audio/${lang}/ad2-scene-05a.mp3`)}
            volume={1}
          />
        </Sequence>
        <Sequence from={t.scene5.bFrom} durationInFrames={t.scene5.bDur}>
          <Audio
            src={staticFile(`audio/${lang}/ad2-scene-05b.mp3`)}
            volume={1}
          />
        </Sequence>
      </Sequence>

      {/* BÖLÜM 3b — Sahne 6: Logo + esprili CTA (50-60sn) — Molo'nun
          teslimiyet repliği, ardından Defne'nin kapanış CTA repliği */}
      <Sequence
        from={5 * SCENE_DURATION_FRAMES}
        durationInFrames={SCENE_DURATION_FRAMES}
        name={`Logo Kapanış (${lang.toUpperCase()})`}
      >
        <RawClip src="clips/ad2-scene-06.mp4" volume={0.25} />
        <Sequence from={t.scene6.aFrom} durationInFrames={t.scene6.aDur}>
          <Audio
            src={staticFile(`audio/${lang}/ad2-scene-06a.mp3`)}
            volume={1}
          />
        </Sequence>
        <Sequence from={t.scene6.bFrom} durationInFrames={t.scene6.bDur}>
          <Audio
            src={staticFile(`audio/${lang}/ad2-scene-06b.mp3`)}
            volume={1}
          />
        </Sequence>
        <LogoWordmark fadeInStart={t.scene6.bFrom} tagline={TAGLINE[lang]} />
      </Sequence>
    </AbsoluteFill>
  );
};
