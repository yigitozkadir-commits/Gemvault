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

export const segments: TimelineSegment[] = [
  { kind: 'storybook', src: `${IMG}/page-01.jpg`, kenBurns: 'zoom-in', startFrame: 0, endFrame: 150 },
  { kind: 'image', src: `${IMG2}/gorsel-01-kursuni-bozkir.jpg`, kenBurns: 'zoom-in', startFrame: 150, endFrame: 510 },
  { kind: 'storybook', src: `${IMG}/page-02.jpg`, kenBurns: 'pan-right', startFrame: 510, endFrame: 1680 },
  { kind: 'image', src: `${IMG2}/gorsel-03-gokyuzune-cagri.jpg`, kenBurns: 'zoom-in', startFrame: 1680, endFrame: 1920 },
  { kind: 'video', src: `${VID}/ai-1-bulut-yarilmasi.mp4`, startFrame: 1920, endFrame: 2220 },
  { kind: 'storybook', src: `${IMG}/page-03.jpg`, kenBurns: 'zoom-out', startFrame: 2220, endFrame: 3323 },
  { kind: 'image', src: `${IMG2}/gorsel-05-kutsal-vadiye-ucus.jpg`, kenBurns: 'pan-right', startFrame: 3323, endFrame: 3623 },
  { kind: 'image', src: `${IMG2}/gorsel-06-kadim-sunak-davul.jpg`, kenBurns: 'zoom-in', startFrame: 3623, endFrame: 3923 },
  { kind: 'storybook', src: `${IMG}/page-04.jpg`, kenBurns: 'zoom-in', startFrame: 3923, endFrame: 4831 },
  { kind: 'storybook', src: `${IMG}/page-05.jpg`, kenBurns: 'pan-down', startFrame: 4831, endFrame: 5716 },
  { kind: 'storybook', src: `${IMG}/page-06.jpg`, kenBurns: 'pan-right', startFrame: 5716, endFrame: 6613 },
  { kind: 'video', src: `${VID}/ai-2-tohum-donusumu.mp4`, startFrame: 6613, endFrame: 6913 },
  { kind: 'image', src: `${IMG2}/gorsel-09-baharin-ilk-cicegi.jpg`, kenBurns: 'zoom-in', startFrame: 6913, endFrame: 7273 },
  { kind: 'storybook', src: `${IMG}/page-07.jpg`, kenBurns: 'pan-right', startFrame: 7273, endFrame: 8133 },
  { kind: 'image', src: `${IMG2}/gorsel-10-ciceklenen-bozkir.jpg`, kenBurns: 'pan-left', startFrame: 8133, endFrame: 8553 },
  { kind: 'storybook', src: `${IMG}/page-08.jpg`, kenBurns: 'pan-right', startFrame: 8553, endFrame: 9481 },
  { kind: 'image', src: `${IMG2}/gorsel-11-yilki-atlari.jpg`, kenBurns: 'pan-right', startFrame: 9481, endFrame: 9781 },
  { kind: 'video', src: `${VID}/ai-3-buz-kirilmasi.mp4`, startFrame: 9781, endFrame: 10081 },
  { kind: 'storybook', src: `${IMG}/page-09.jpg`, kenBurns: 'pan-down', startFrame: 10081, endFrame: 10953 },
  { kind: 'storybook', src: `${IMG}/page-10.jpg`, kenBurns: 'zoom-out', startFrame: 10953, endFrame: 11877 },
  { kind: 'image', src: `${IMG2}/gorsel-12-safak-sonsuz-bahar.jpg`, kenBurns: 'zoom-out', startFrame: 11877, endFrame: 12327 },
  { kind: 'storybook', src: `${IMG}/page-11.jpg`, kenBurns: 'zoom-in', startFrame: 12327, endFrame: 12477 },
  { kind: 'video', src: `${VID}/kapanis.mp4`, startFrame: 12477, endFrame: 12688 },
];

export const TOTAL_FRAMES = 12688; // ~7:03 @ 30fps

// "Karakter" ara görselleri — sayfa akışını kesmeden, ilgili repliğin
// üstüne kısa bindirme (cutaway) olarak gösterilir.
export const cutaways: Cutaway[] = [
  { src: `${IMG2}/gorsel-02-umay-kagan-huznu.jpg`, startFrame: 1344, endFrame: 1434 },
  { src: `${IMG2}/gorsel-04-turul-heybeti.jpg`, startFrame: 2554, endFrame: 2674 },
  { src: `${IMG2}/gorsel-07-davulu-kesif.jpg`, startFrame: 4539, endFrame: 4689 },
  { src: `${IMG2}/gorsel-08-umay-ninnisi.jpg`, startFrame: 5019, endFrame: 5199 },
];

export const GUM_FRAME = 4955;
export const GUM_TRIPLE_FRAME = 5314;

// Sayfa segmentlerinin (kind==='storybook' VE gerçek anlatım içeren, yani
// kapak/arka kapak hariç) aralıkları — müzik ducking için kullanılır.
export const NARRATED_RANGES: [number, number][] = [
  [510, 1680],
  [2220, 3323],
  [3923, 4831],
  [4831, 5716],
  [5716, 6613],
  [7273, 8133],
  [8553, 9481],
  [10081, 10953],
  [10953, 11877],
];
