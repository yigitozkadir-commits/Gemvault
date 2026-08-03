// ElevenLabs "with-timestamps" hizalamasından türetilmiştir (30fps) —
// gerçek kelime-bazlı zaman kodlarıyla (AnimatedCaptions'ın fallback'e
// ihtiyacı yok). Kaynak: public/audio/loulan_v2_narration.mp3 — Deniz
// (Calm Narrator), v1'e göre daha düşük stability / daha yüksek style
// ("sıcak, el işçiliğine hayranlık duyan" ton — "Elleriyle Bıraktıkları").
import type { CaptionCue } from "../types/captions";

export const LOULAN_GUZELI_V2_CAPTIONS: CaptionCue[] = [
  {
    text: "Kim olduğunu bilmiyoruz.",
    startFrame: 0,
    endFrame: 44,
    words: [
      { text: "Kim", startFrame: 0, endFrame: 7 },
      { text: "olduğunu", startFrame: 10, endFrame: 18 },
      { text: "bilmiyoruz.", startFrame: 20, endFrame: 44 },
    ],
  },
  {
    text: "Ama elleriyle ne yaptığını biliyoruz.",
    startFrame: 55,
    endFrame: 125,
    words: [
      { text: "Ama", startFrame: 55, endFrame: 66 },
      { text: "elleriyle", startFrame: 70, endFrame: 86 },
      { text: "ne", startFrame: 88, endFrame: 90 },
      { text: "yaptığını", startFrame: 91, endFrame: 102 },
      { text: "biliyoruz.", startFrame: 103, endFrame: 125 },
    ],
  },
  {
    text: "Giysisindeki yırtığı, kendi elleriyle, kendi ipliğiyle onarmış.",
    startFrame: 146,
    endFrame: 286,
    words: [
      { text: "Giysisindeki", startFrame: 146, endFrame: 171 },
      { text: "yırtığı,", startFrame: 172, endFrame: 193 },
      { text: "kendi", startFrame: 197, endFrame: 208 },
      { text: "elleriyle,", startFrame: 210, endFrame: 233 },
      { text: "kendi", startFrame: 236, endFrame: 247 },
      { text: "ipliğiyle", startFrame: 248, endFrame: 262 },
      { text: "onarmış.", startFrame: 263, endFrame: 286 },
    ],
  },
  {
    text: "Aynı vahada yaşayan insanlar süt içiyordu — bünyeleri buna tam uygun olmasa bile.",
    startFrame: 301,
    endFrame: 477,
    words: [
      { text: "Aynı", startFrame: 301, endFrame: 312 },
      { text: "vahada", startFrame: 313, endFrame: 328 },
      { text: "yaşayan", startFrame: 332, endFrame: 345 },
      { text: "insanlar", startFrame: 347, endFrame: 363 },
      { text: "süt", startFrame: 364, endFrame: 370 },
      { text: "içiyordu", startFrame: 372, endFrame: 389 },
      { text: "—", startFrame: 395, endFrame: 402 },
      { text: "bünyeleri", startFrame: 405, endFrame: 422 },
      { text: "buna", startFrame: 424, endFrame: 431 },
      { text: "tam", startFrame: 433, endFrame: 439 },
      { text: "uygun", startFrame: 441, endFrame: 450 },
      { text: "olmasa", startFrame: 452, endFrame: 463 },
      { text: "bile.", startFrame: 464, endFrame: 477 },
    ],
  },
  {
    text: "Yanına bıraktığı sepet, tarak ve savurma teknesi, hâlâ aynı sabırla dokunmuş duruyor.",
    startFrame: 495,
    endFrame: 673,
    words: [
      { text: "Yanına", startFrame: 495, endFrame: 506 },
      { text: "bıraktığı", startFrame: 508, endFrame: 521 },
      { text: "sepet,", startFrame: 523, endFrame: 539 },
      { text: "tarak", startFrame: 542, endFrame: 555 },
      { text: "ve", startFrame: 557, endFrame: 559 },
      { text: "savurma", startFrame: 560, endFrame: 573 },
      { text: "teknesi,", startFrame: 574, endFrame: 599 },
      { text: "hâlâ", startFrame: 605, endFrame: 617 },
      { text: "aynı", startFrame: 620, endFrame: 628 },
      { text: "sabırla", startFrame: 630, endFrame: 639 },
      { text: "dokunmuş", startFrame: 640, endFrame: 654 },
      { text: "duruyor.", startFrame: 656, endFrame: 673 },
    ],
  },
  {
    text: "Belki adını hiç bilmeyeceğiz — ama emeğini, bugün hâlâ elimizde tutuyoruz.",
    startFrame: 685,
    endFrame: 842,
    words: [
      { text: "Belki", startFrame: 685, endFrame: 695 },
      { text: "adını", startFrame: 696, endFrame: 703 },
      { text: "hiç", startFrame: 704, endFrame: 709 },
      { text: "bilmeyeceğiz", startFrame: 711, endFrame: 730 },
      { text: "—", startFrame: 738, endFrame: 742 },
      { text: "ama", startFrame: 746, endFrame: 754 },
      { text: "emeğini,", startFrame: 755, endFrame: 773 },
      { text: "bugün", startFrame: 776, endFrame: 785 },
      { text: "hâlâ", startFrame: 787, endFrame: 799 },
      { text: "elimizde", startFrame: 800, endFrame: 811 },
      { text: "tutuyoruz.", startFrame: 813, endFrame: 842 },
    ],
  },
];

// Rapor kuralı: v1'deki zorunlu bilimsel dipnot bu versiyonda da aynı
// şekilde, kapanışta küçük/soluk punto ile korunur.
export const LOULAN_GUZELI_V2_FOOTNOTE =
  "Bilimsel rekonstrüksiyon denemesi. Göz rengi, ten tonu ve yaşarken saç rengi bilinmemektedir; nötr tercih yapılmıştır.";
