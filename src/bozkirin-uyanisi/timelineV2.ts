import type { KenBurnsDirection } from '../taidula-epic/segments';

/**
 * "Bozkırın Uyanışı" v2 — genişletilmiş kurgu.
 *
 * Tüm sayı/karelerin türetildiği hesaplama: /tmp/build_bozkirin_v2.py
 * (bkz. docs/bozkirin-uyanisi-uretim-plani.md). Özet mantık:
 *  - 9 anlatımlı kitap sayfası (orijinal içerik/süre AYNEN korunur)
 *  - Sayfalar arasına 8 "manzara" ara görsel + 3 Google Flow AI videosu,
 *    müzik-only boşluklar olarak eklendi — bu boşluklara denk gelen
 *    sessizlik, anlatım ses dosyasının KENDİSİNE splice edildi (bkz.
 *    public/audio/bozkirin-uyanisi-anlatim-v2.mp3), böylece
 *    görsel/ses/altyazı hep mutlak (absolute frame) senkron kalıyor.
 *  - 4 "karakter" ara görsel (Umay hüznü, Turul heybeti, davulu keşif,
 *    Umay'ın ninnisi) sayfa akışını KESMEDEN, ilgili repliğin üstüne kısa
 *    süreli bindirme (cutaway) olarak gösteriliyor.
 *  - Kapanışta yeni video eklendi.
 */

export type SegmentKind = 'storybook' | 'image' | 'video';

export interface TimelineSegment {
  kind: SegmentKind;
  src: string;
  startFrame: number;
  endFrame: number;
  kenBurns?: KenBurnsDirection;
}

export interface Cutaway {
  src: string;
  startFrame: number;
  endFrame: number;
}

const IMG = 'images/bozkirin-uyanisi';
const IMG2 = 'images/bozkirin-uyanisi-v2';
const VID = 'videos/bozkirin-uyanisi';

export const CROSSFADE_FRAMES = 15;

// Anlatım ses dosyası (bozkirin-uyanisi-anlatim-v2.mp3) doğrudan sayfa 2
// içeriğiyle t=0'da başlıyor (splice sırasında öne sessizlik eklenmedi).
// Kapak + interstitial1'in ekranda kaldığı süre kadar (5s + 20s = 750
// frame) <Audio> bileşeni bir <Sequence from={NARRATION_START_FRAME}>
// içine alınmalı — aksi halde anlatım videoyla 25 saniye erken/kaymış
// çalar (bkz. segments[2] "page2", startFrame: 750).
export const NARRATION_START_FRAME = 750;

export const segments: TimelineSegment[] = [
  { kind: 'storybook', src: `${IMG}/page-01.jpg`, kenBurns: 'zoom-in', startFrame: 0, endFrame: 150 },
  { kind: 'image', src: `${IMG2}/gorsel-01-kursuni-bozkir.jpg`, kenBurns: 'zoom-in', startFrame: 150, endFrame: 750 },
  { kind: 'storybook', src: `${IMG}/page-02.jpg`, kenBurns: 'pan-right', startFrame: 750, endFrame: 1920 },
  { kind: 'image', src: `${IMG2}/gorsel-03-gokyuzune-cagri.jpg`, kenBurns: 'zoom-in', startFrame: 1920, endFrame: 2340 },
  { kind: 'video', src: `${VID}/ai-1-bulut-yarilmasi.mp4`, startFrame: 2340, endFrame: 2640 },
  { kind: 'storybook', src: `${IMG}/page-03.jpg`, kenBurns: 'zoom-out', startFrame: 2640, endFrame: 3743 },
  { kind: 'image', src: `${IMG2}/gorsel-05-kutsal-vadiye-ucus.jpg`, kenBurns: 'pan-right', startFrame: 3743, endFrame: 4223 },
  { kind: 'image', src: `${IMG2}/gorsel-06-kadim-sunak-davul.jpg`, kenBurns: 'zoom-in', startFrame: 4223, endFrame: 4703 },
  { kind: 'storybook', src: `${IMG}/page-04.jpg`, kenBurns: 'zoom-in', startFrame: 4703, endFrame: 5611 },
  { kind: 'storybook', src: `${IMG}/page-05.jpg`, kenBurns: 'pan-down', startFrame: 5611, endFrame: 6496 },
  { kind: 'storybook', src: `${IMG}/page-06.jpg`, kenBurns: 'pan-right', startFrame: 6496, endFrame: 7393 },
  { kind: 'video', src: `${VID}/ai-2-tohum-donusumu.mp4`, startFrame: 7393, endFrame: 7693 },
  { kind: 'image', src: `${IMG2}/gorsel-09-baharin-ilk-cicegi.jpg`, kenBurns: 'zoom-in', startFrame: 7693, endFrame: 8293 },
  { kind: 'storybook', src: `${IMG}/page-07.jpg`, kenBurns: 'pan-right', startFrame: 8293, endFrame: 9153 },
  { kind: 'image', src: `${IMG2}/gorsel-10-ciceklenen-bozkir.jpg`, kenBurns: 'pan-left', startFrame: 9153, endFrame: 9873 },
  { kind: 'storybook', src: `${IMG}/page-08.jpg`, kenBurns: 'pan-right', startFrame: 9873, endFrame: 10801 },
  { kind: 'image', src: `${IMG2}/gorsel-11-yilki-atlari.jpg`, kenBurns: 'pan-right', startFrame: 10801, endFrame: 11281 },
  { kind: 'video', src: `${VID}/ai-3-buz-kirilmasi.mp4`, startFrame: 11281, endFrame: 11581 },
  { kind: 'storybook', src: `${IMG}/page-09.jpg`, kenBurns: 'pan-down', startFrame: 11581, endFrame: 12453 },
  { kind: 'storybook', src: `${IMG}/page-10.jpg`, kenBurns: 'zoom-out', startFrame: 12453, endFrame: 13377 },
  { kind: 'image', src: `${IMG2}/gorsel-12-safak-sonsuz-bahar.jpg`, kenBurns: 'zoom-out', startFrame: 13377, endFrame: 14217 },
  { kind: 'storybook', src: `${IMG}/page-11.jpg`, kenBurns: 'zoom-in', startFrame: 14217, endFrame: 14367 },
  { kind: 'video', src: `${VID}/kapanis.mp4`, startFrame: 14367, endFrame: 14578 },
];

export const TOTAL_FRAMES = 14578; // ~8:06 @ 30fps

// "Karakter" ara görselleri — sayfa akışını kesmeden, ilgili repliğin
// üstüne kısa bindirme (cutaway) olarak gösterilir.
export const cutaways: Cutaway[] = [
  { src: `${IMG2}/gorsel-02-umay-kagan-huznu.jpg`, startFrame: 1606, endFrame: 1652 },
  { src: `${IMG2}/gorsel-04-turul-heybeti.jpg`, startFrame: 2999, endFrame: 3070 },
  { src: `${IMG2}/gorsel-07-davulu-kesif.jpg`, startFrame: 5348, endFrame: 5440 },
  { src: `${IMG2}/gorsel-08-umay-ninnisi.jpg`, startFrame: 5811, endFrame: 5967 },
];

export const GUM_FRAME = 5735;
export const GUM_TRIPLE_FRAME = 6094;

// Sayfa segmentlerinin (kind==='storybook' VE gerçek anlatım içeren, yani
// kapak/arka kapak hariç) aralıkları — müzik ducking için kullanılır.
// Ek 3 kısa konuşma (ara sahnelerin içine, ana yapıyı bozmadan eklendi)
// da buraya dahil, böylece müzik onların altında da kısılıyor.
export const NARRATED_RANGES: [number, number][] = [
  [210, 430], // ek: "Bozkır bize bir şey anlatmaya çalışıyor..."
  [750, 1920],
  [2640, 3743],
  [4703, 5611],
  [5611, 6496],
  [6496, 7393],
  [7783, 8011], // ek: "Doğa, birlikte yaşadığımız büyük bir ailedir."
  [8293, 9153],
  [9873, 10801],
  [11581, 12453],
  [12453, 13377],
  [13617, 13858], // ek: kapanış sözü
];

// Ek konuşma ses dosyaları — mevcut sayfa yapısını bozmadan, zaten
// müzik-only olan ara sahnelerin sessiz kısımlarına yerleştirildi.
export interface ExtraLine {
  src: string;
  startFrame: number;
}
export const EXTRA_LINES: ExtraLine[] = [
  { src: 'audio/bozkirin-uyanisi-extra/extra1-bozkir-firsati.mp3', startFrame: 210 },
  { src: 'audio/bozkirin-uyanisi-extra/extra2-buyuk-aile.mp3', startFrame: 7783 },
  { src: 'audio/bozkirin-uyanisi-extra/extra3-kapanis-sozu.mp3', startFrame: 13617 },
];
