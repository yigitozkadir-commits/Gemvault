// ElevenLabs "with-timestamps" hizalamasından türetilmiştir (30fps).
// Kaynak: public/audio/suyumbike_narration.mp3 — Deniz (Calm Narrator), seri sesi.
// İki ayrı TTS çağrısının (normal hız + ihanet sonrası %7 yavaş) birleştirilmiş
// zaman kodları.
import type { CaptionCue } from "./chingHatunCaptions";

export const SUYUMBIKE_HATUN_CAPTIONS: CaptionCue[] = [
  {
    text: "Kazan Hanlığı'nda küçük bir çocuk tahta oturduğunda,",
    startFrame: 0,
    endFrame: 93,
  },
  {
    text: "gerçek gücü elinde tutan annesiydi.",
    startFrame: 99,
    endFrame: 171,
  },
  {
    text: "Süyümbike, oğlu Ötemiş Giray adına devleti yönetti",
    startFrame: 189,
    endFrame: 294,
  },
  {
    text: "— kararları o aldı, mührü o bastı.",
    startFrame: 296,
    endFrame: 373,
  },
  {
    text: "Ruslar Kazan'ı kuşattığında, bazı kayıtlara göre surlara bizzat çıkıp savunmayı yönetti.",
    startFrame: 388,
    endFrame: 578,
  },
  {
    text: "Ama şehir içindeki ihanet, dışarıdaki orduyla aynı anda geldi.",
    startFrame: 579,
    endFrame: 735,
  },
  {
    text: "Oğluyla birlikte teslim edildi, Moskova'ya götürüldü",
    startFrame: 747,
    endFrame: 848,
  },
  {
    text: "— ve Kazan'daki o kule, bugün hâlâ onun adını taşıyor.",
    startFrame: 852,
    endFrame: 988,
  },
];
