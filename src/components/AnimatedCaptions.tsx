import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionCue, CaptionWord } from "../types/captions";

// Montserrat ExtraBold'u önce Google Fonts CDN'inden (bu ortamda sertifika
// hatası), sonra base64 gömülü FontFace API ile (paralel render
// sekmelerinde ara sıra delayRender() sonsuza kadar takılı kalıyor) yüklemeyi
// denedik — ikisi de bu render ortamında güvenilir değil. Bunun yerine hiçbir
// yükleme/ağ/IO gerektirmeyen, her Chromium'da hazır bulunan kalın bir
// sistem sans-serif yığını kullanıyoruz; görsel olarak Montserrat
// ExtraBold'a çok yakın bir sonuç verir ve render'ı asla kilitlemez.
const fontFamily = "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const POP_FRAMES = 5;
const SETTLE_FRAMES = 4;
const WAITING_OPACITY = 0.4;
const ACTIVE_SCALE = 1.05;

/** Gerçek kelime zamanlaması yoksa, cümle süresini kelime uzunluğuna
 * orantılı bölerek bir fallback üretir (daha uzun kelimeye daha çok frame). */
const synthesizeWords = (cue: CaptionCue): CaptionWord[] => {
  const tokens = cue.text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const totalChars = tokens.reduce((sum, t) => sum + t.length, 0) || 1;
  const totalFrames = Math.max(1, cue.endFrame - cue.startFrame);
  let cursor = cue.startFrame;
  return tokens.map((t, i) => {
    const isLast = i === tokens.length - 1;
    const share = Math.round((t.length / totalChars) * totalFrames);
    const start = cursor;
    const end = isLast ? cue.endFrame : Math.min(cue.endFrame, start + Math.max(1, share));
    cursor = end;
    return { text: t, startFrame: start, endFrame: end };
  });
};

const Word: React.FC<{ word: CaptionWord; fontSize: number }> = ({ word, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isUpcoming = frame < word.startFrame;
  const isActive = frame >= word.startFrame && frame <= word.endFrame;

  const entry = spring({
    frame: Math.max(frame - word.startFrame, 0),
    fps,
    durationInFrames: POP_FRAMES,
    config: { damping: 14, mass: 0.5 },
  });
  const settle = spring({
    frame: Math.max(frame - word.endFrame, 0),
    fps,
    durationInFrames: SETTLE_FRAMES,
    config: { damping: 14, mass: 0.5 },
  });

  const opacity = isUpcoming ? WAITING_OPACITY : interpolate(entry, [0, 1], [WAITING_OPACITY, 1]);
  const scale = isUpcoming
    ? 1
    : isActive
      ? interpolate(entry, [0, 1], [1, ACTIVE_SCALE])
      : interpolate(settle, [0, 1], [ACTIVE_SCALE, 1]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `scale(${scale})`,
        marginRight: "0.28em",
        willChange: "transform, opacity",
      }}
    >
      {word.text}
    </span>
  );
};

export const AnimatedCaptions: React.FC<{
  cues: CaptionCue[];
  /** Yazı bloğunun alt kenardan uzaklığı (yüksekliğin oranı olarak).
   *  Varsayılan 0.13 — dikey Instagram/Reels videolarındaki "%10 yukarı"
   *  konumu. Resimli kitap gibi görselin tüm kadrajı doldurduğu 16:9
   *  yapımlarda daha alta (örn. 0.03) çekilerek yüzlerin üstünü kapatması
   *  engellenebilir. */
  bottomOffsetRatio?: number;
}> = ({ cues, bottomOffsetRatio = 0.13 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const active = cues.find((c) => frame >= c.startFrame && frame <= c.endFrame + 6);
  if (!active) return null;

  const words = active.words ?? synthesizeWords(active);

  // Yüksekliğin yüzdesi olarak font boyutu — sabit piksel yok. Instagram
  // için daha büyük/okunaklı olsun diye orijinal 0.052'den 0.068'e, sonra
  // ekstra %20 daha büyütme talebiyle 0.068 * 1.2 = 0.0816'ya yükseltildi.
  const baseFontSize = height * 0.068 * 1.2;
  const maxWidthPx = width * 0.88;

  // Gerçek DOM ölçümü olmadan kaba bir tahmin: ortalama karakter genişliği
  // ~fontSize*0.56 (Montserrat ExtraBold için makul bir oran). Uzun
  // repliklerde 2 satıra sığacak fontSize'ı formülle hesaplayıp, çok kısa
  // düşmemesi için taban (%45) ve büyümemesi için tavan (baseFontSize) ile
  // sınırlandırıyoruz — düz bir "%10-15 küçült" yetmiyor çünkü bazı
  // repliklerin karakter sayısı 2 satıra ancak çok daha küçük bir puntoyla
  // sığıyor.
  const CHAR_WIDTH_RATIO = 0.56;
  const TARGET_LINES = 2;
  const fitFontSize =
    (TARGET_LINES * maxWidthPx) / (CHAR_WIDTH_RATIO * Math.max(1, active.text.length));
  const fontSize = Math.min(baseFontSize, Math.max(baseFontSize * 0.45, fitFontSize));

  // Yazı bloğu hem %20 büyüdüğü hem de %10 yukarı kaydığı için, altındaki
  // karartma/vignette gradyanı da orantılı olarak büyütüldü — aksi halde
  // büyümüş metnin üst kısmı gradyansız (düz video üzerinde) kalırdı.
  // (bottomOffsetRatio - 0.03) sayesinde varsayılan 0.13'te bu ifade tam olarak
  // eski "+ height * 0.1" değerine eşit kalır — mevcut videoların görüntüsü
  // değişmez, sadece offset değiştirildiğinde gradyan da onunla birlikte kayar.
  const gradientHeight = height * (170 / 1080) * 1.2 + height * (bottomOffsetRatio - 0.03);

  const cueLocalIn = frame - active.startFrame;
  const cueLocalOut = frame - active.endFrame;
  const blockFadeIn = interpolate(cueLocalIn, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blockFadeOut = interpolate(cueLocalOut, [0, 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blockOpacity = Math.min(blockFadeIn, blockFadeOut);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          top: "auto",
          height: gradientHeight,
          background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          // Ekstra talep üzerine format %10 yukarı kaydırıldı (0.03 -> 0.13).
          paddingBottom: height * bottomOffsetRatio,
          opacity: blockOpacity,
        }}
      >
        <div
          style={{
            maxWidth: "88%",
            textAlign: "center",
            fontFamily,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
            WebkitTextStroke: "2px rgba(0,0,0,0.45)",
            textShadow:
              "0 0 8px rgba(0,0,0,0.8), 2px 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          {words.map((w, i) => (
            <Word key={`${active.startFrame}-${i}`} word={w} fontSize={fontSize} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
