// ElevenLabs "with-timestamps" hizalamasından türetilmiştir (30fps) —
// gerçek kelime-bazlı zaman kodlarıyla (AnimatedCaptions'ın fallback'e
// ihtiyacı yok). Kaynak: public/audio/loulan_narration.mp3 — Deniz
// (Calm Narrator), seride en yüksek stability / en düşük style ile
// ("akademik/nötr" ton — Subeşi Cadıları'ndan bile bir adım daha sakin).
import type { CaptionCue } from "../types/captions";

export const LOULAN_GUZELI_CAPTIONS: CaptionCue[] = [
  {
    text: "Bin dokuz yüz seksende, Lop Nur'un kenarında, rüzgârın açığa çıkardığı bir mezar bulundu.",
    startFrame: 0,
    endFrame: 179,
    words: [
      { text: "Bin", startFrame: 0, endFrame: 8 },
      { text: "dokuz", startFrame: 9, endFrame: 20 },
      { text: "yüz", startFrame: 21, endFrame: 28 },
      { text: "seksende,", startFrame: 29, endFrame: 49 },
      { text: "Lop", startFrame: 55, endFrame: 65 },
      { text: "Nur'un", startFrame: 66, endFrame: 81 },
      { text: "kenarında,", startFrame: 82, endFrame: 103 },
      { text: "rüzgârın", startFrame: 110, endFrame: 128 },
      { text: "açığa", startFrame: 129, endFrame: 140 },
      { text: "çıkardığı", startFrame: 141, endFrame: 156 },
      { text: "bir", startFrame: 157, endFrame: 162 },
      { text: "mezar", startFrame: 163, endFrame: 173 },
      { text: "bulundu.", startFrame: 174, endFrame: 179 },
    ],
  },
  {
    text: "İçinde, kuru dallarla örtülü bir kadın vardı — yaklaşık üç bin sekiz yüz yıldır orada, tek başına.",
    startFrame: 193,
    endFrame: 410,
    words: [
      { text: "İçinde,", startFrame: 193, endFrame: 206 },
      { text: "kuru", startFrame: 213, endFrame: 222 },
      { text: "dallarla", startFrame: 223, endFrame: 238 },
      { text: "örtülü", startFrame: 239, endFrame: 251 },
      { text: "bir", startFrame: 252, endFrame: 257 },
      { text: "kadın", startFrame: 258, endFrame: 269 },
      { text: "vardı", startFrame: 270, endFrame: 281 },
      { text: "—", startFrame: 282, endFrame: 285 },
      { text: "yaklaşık", startFrame: 292, endFrame: 309 },
      { text: "üç", startFrame: 310, endFrame: 315 },
      { text: "bin", startFrame: 316, endFrame: 323 },
      { text: "sekiz", startFrame: 324, endFrame: 335 },
      { text: "yüz", startFrame: 336, endFrame: 344 },
      { text: "yıldır", startFrame: 345, endFrame: 357 },
      { text: "orada,", startFrame: 358, endFrame: 373 },
      { text: "tek", startFrame: 380, endFrame: 388 },
      { text: "başına.", startFrame: 389, endFrame: 410 },
    ],
  },
  {
    text: "Yanına konan tarak, örülü sepet ve savurma teknesi, hâlâ aynı yerde duruyor.",
    startFrame: 428,
    endFrame: 599,
    words: [
      { text: "Yanına", startFrame: 428, endFrame: 441 },
      { text: "konan", startFrame: 442, endFrame: 453 },
      { text: "tarak,", startFrame: 454, endFrame: 470 },
      { text: "örülü", startFrame: 477, endFrame: 489 },
      { text: "sepet", startFrame: 490, endFrame: 501 },
      { text: "ve", startFrame: 502, endFrame: 507 },
      { text: "savurma", startFrame: 508, endFrame: 523 },
      { text: "teknesi,", startFrame: 524, endFrame: 543 },
      { text: "hâlâ", startFrame: 550, endFrame: 560 },
      { text: "aynı", startFrame: 561, endFrame: 571 },
      { text: "yerde", startFrame: 572, endFrame: 583 },
      { text: "duruyor.", startFrame: 584, endFrame: 599 },
    ],
  },
  {
    text: "Ama adı, konuştuğu dil, hangi halka ait olduğu bilinmiyor —",
    startFrame: 611,
    endFrame: 738,
    words: [
      { text: "Ama", startFrame: 611, endFrame: 619 },
      { text: "adı,", startFrame: 620, endFrame: 632 },
      { text: "konuştuğu", startFrame: 639, endFrame: 656 },
      { text: "dil,", startFrame: 657, endFrame: 667 },
      { text: "hangi", startFrame: 674, endFrame: 685 },
      { text: "halka", startFrame: 686, endFrame: 697 },
      { text: "ait", startFrame: 698, endFrame: 705 },
      { text: "olduğu", startFrame: 706, endFrame: 719 },
      { text: "bilinmiyor", startFrame: 720, endFrame: 736 },
      { text: "—", startFrame: 737, endFrame: 738 },
    ],
  },
  {
    text: '"Loulan" ismi bile ona değil, çok daha sonra kurulan bir krallığa ait.',
    startFrame: 743,
    endFrame: 885,
    words: [
      { text: '"Loulan"', startFrame: 743, endFrame: 761 },
      { text: "ismi", startFrame: 762, endFrame: 772 },
      { text: "bile", startFrame: 773, endFrame: 782 },
      { text: "ona", startFrame: 783, endFrame: 791 },
      { text: "değil,", startFrame: 792, endFrame: 807 },
      { text: "çok", startFrame: 813, endFrame: 821 },
      { text: "daha", startFrame: 822, endFrame: 831 },
      { text: "sonra", startFrame: 832, endFrame: 843 },
      { text: "kurulan", startFrame: 844, endFrame: 858 },
      { text: "bir", startFrame: 859, endFrame: 864 },
      { text: "krallığa", startFrame: 865, endFrame: 879 },
      { text: "ait.", startFrame: 880, endFrame: 885 },
    ],
  },
  {
    text: "Belki de tarihin en dürüst cümlesi budur: bilmiyoruz.",
    startFrame: 895,
    endFrame: 1009,
    words: [
      { text: "Belki", startFrame: 895, endFrame: 906 },
      { text: "de", startFrame: 907, endFrame: 912 },
      { text: "tarihin", startFrame: 913, endFrame: 927 },
      { text: "en", startFrame: 928, endFrame: 933 },
      { text: "dürüst", startFrame: 934, endFrame: 947 },
      { text: "cümlesi", startFrame: 948, endFrame: 962 },
      { text: "budur:", startFrame: 963, endFrame: 977 },
      { text: "bilmiyoruz.", startFrame: 978, endFrame: 1009 },
    ],
  },
];

// Rapor kuralı: kapanışta 3-4 saniye küçük/soluk bir dipnot.
export const LOULAN_GUZELI_FOOTNOTE =
  "Bilimsel rekonstrüksiyon denemesi. Göz rengi, ten tonu ve yaşarken saç rengi bilinmemektedir; nötr tercih yapılmıştır.";
