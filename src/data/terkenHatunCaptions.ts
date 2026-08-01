// ElevenLabs "with-timestamps" hizalamasından türetilmiştir (30fps).
// Kaynak: public/audio/terken_narration.mp3 — Deniz (Calm Narrator), seri sesi.
// İki ayrı TTS çağrısının (normal hız + son iki cümle %10 yavaş) birleştirilmiş
// zaman kodları.
import type { CaptionCue } from "./chingHatunCaptions";

export const TERKEN_HATUN_CAPTIONS: CaptionCue[] = [
  {
    text: "Harezmşahlar sarayında iki mühür vardı:",
    startFrame: 0,
    endFrame: 79,
  },
  {
    text: "biri sultanın, diğeri annesininki.",
    startFrame: 93,
    endFrame: 165,
  },
  {
    text: "Terken Hatun'un kendi divanı, kendi katipleri, kendi ordusu vardı",
    startFrame: 190,
    endFrame: 350,
  },
  {
    text: "— oğlu Sultan Muhammed'in bile giremediği bir otorite.",
    startFrame: 365,
    endFrame: 458,
  },
  {
    text: "Ama güç paylaşılmıyordu.",
    startFrame: 473,
    endFrame: 535,
  },
  {
    text: "Anne ile oğul, aynı tahtın gölgesinde birbirine rakip oldu.",
    startFrame: 556,
    endFrame: 690,
  },
  {
    text: "Bin iki yüz yirmide ufukta beliren toz bulutu, bu iç çekişmenin bedelini hatırlatacaktı:",
    startFrame: 692,
    endFrame: 876,
  },
  {
    text: "Moğollar geldiğinde, ne oğlu ne de kendi ordusu onu kurtarabildi.",
    startFrame: 890,
    endFrame: 1038,
  },
];
