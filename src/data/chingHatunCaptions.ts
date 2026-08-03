// ElevenLabs "with-timestamps" hizalamasından türetilmiştir (30fps).
// Kaynak: public/audio/narration.mp3 — Deniz (Calm Narrator) sesi.
import type { CaptionCue } from "../types/captions";
export type { CaptionCue, CaptionWord } from "../types/captions";

export const CING_HATUN_CAPTIONS: CaptionCue[] = [
  {
    text: "Bir kağan henüz bir çocukken, tahtın gerçek gücü genellikle yanındaki kadındaydı.",
    startFrame: 0,
    endFrame: 160,
  },
  {
    text: "Çing Hatun, Göktürk'ün batı kolunda bu gücü elinde tutan \"Tonguç\"tu.",
    startFrame: 173,
    endFrame: 308,
  },
  {
    text: "Devlet hazinesinin bir kısmı onun elindeydi; beyler, kararları için onun onayını beklerdi",
    startFrame: 318,
    endFrame: 489,
  },
  {
    text: "— bu bir gelenek değil, resmi bir makamdı.",
    startFrame: 494,
    endFrame: 580,
  },
  {
    text: "Tang sarayına yazdığı mektuplar, bugün hâlâ Çin yıllıklarında duruyor.",
    startFrame: 593,
    endFrame: 726,
  },
  {
    text: "Bir bozkır kadını, bir imparatorlukla diplomasi yürütüyordu.",
    startFrame: 738,
    endFrame: 853,
  },
];
