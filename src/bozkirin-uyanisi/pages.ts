import type { KenBurnsDirection } from '../taidula-epic/segments';

/**
 * "Bozkırın Uyanışı — Umay ve Kağan'ın Destanı" resimli çocuk kitabı.
 * 11 sayfa, her biri PDF'ten çıkarılan yüksek çözünürlüklü görsel.
 * Sayfa 1 (kapak) ve sayfa 11 (arka kapak) sessiz — narration sadece
 * sayfa 2-10 arası, gerçek ElevenLabs zaman kodlarına göre konumlandı
 * (bkz. src/data/bozkirinUyanisiCaptions.ts / INTRO_HOLD_FRAMES).
 */
export interface BookPage {
  id: number;
  src: string;
  kenBurns: KenBurnsDirection;
  startFrame: number;
  endFrame: number;
}

export const pages: BookPage[] = [
  { id: 1, src: 'images/bozkirin-uyanisi/page-01.jpg', kenBurns: 'zoom-in', startFrame: 0, endFrame: 152 },
  { id: 2, src: 'images/bozkirin-uyanisi/page-02.jpg', kenBurns: 'pan-right', startFrame: 152, endFrame: 1320 },
  { id: 3, src: 'images/bozkirin-uyanisi/page-03.jpg', kenBurns: 'zoom-out', startFrame: 1320, endFrame: 2423 },
  { id: 4, src: 'images/bozkirin-uyanisi/page-04.jpg', kenBurns: 'zoom-in', startFrame: 2423, endFrame: 3331 },
  { id: 5, src: 'images/bozkirin-uyanisi/page-05.jpg', kenBurns: 'zoom-in', startFrame: 3331, endFrame: 4216 },
  { id: 6, src: 'images/bozkirin-uyanisi/page-06.jpg', kenBurns: 'pan-down', startFrame: 4216, endFrame: 5113 },
  { id: 7, src: 'images/bozkirin-uyanisi/page-07.jpg', kenBurns: 'pan-right', startFrame: 5113, endFrame: 5973 },
  { id: 8, src: 'images/bozkirin-uyanisi/page-08.jpg', kenBurns: 'pan-right', startFrame: 5973, endFrame: 6901 },
  { id: 9, src: 'images/bozkirin-uyanisi/page-09.jpg', kenBurns: 'pan-down', startFrame: 6901, endFrame: 7773 },
  { id: 10, src: 'images/bozkirin-uyanisi/page-10.jpg', kenBurns: 'zoom-out', startFrame: 7773, endFrame: 8697 },
  { id: 11, src: 'images/bozkirin-uyanisi/page-11.jpg', kenBurns: 'zoom-in', startFrame: 8697, endFrame: 8847 },
];

export const CROSSFADE_FRAMES = 15;
export const TOTAL_FRAMES = 8847; // ~4:55 @ 30fps — sadece PDF+narration, AI video eklentileri henüz yok
