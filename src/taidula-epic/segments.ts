/**
 * TAIDULA — "Buz Altında Bir Hükümdar" (v2 — 8+ dakika)
 * 24 segment (10 AI video kullanımı + 14 görsel kullanımı) = 350s ham
 * ×1.5 yavaşlatma, crossfade düşümüyle → ~513s final (8:33)
 *
 * ÖNEMLİ: Her segmentin KENDİ durationInSeconds değeri kullanılır (bkz.
 * Timeline.tsx / TaidulaEpicFilm.tsx'teki finalFramesFor()) — video
 * segmentleri hep 10s ham (Google Flow'un fiziksel klip uzunluğu,
 * playbackRate ile ~15s final'e yayılır); görsellerin ham süresi değişken
 * ve daha uzun tutuldu (16-20s) — ekranda daha uzun kalmaları ve daha uzun
 * anlatım metnine yer açmaları için.
 *
 * id 19 (devlet istikrarı) mevcut gorsel-12 (miras kolajı) görselini
 * kullanıyor; id 20 (saray ruinleri) ve id 21 (arşiv+mühür) için ayrı,
 * yeni üretilmiş görseller eklendi (gorsel-13, gorsel-14).
 */

export type SegmentType = 'video' | 'image';
export type KenBurnsDirection =
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'pan-down';
export type ColorVariant = 'neutral' | 'cool' | 'warm';

export interface Segment {
  id: number;
  type: SegmentType;
  label: string;
  /** public/ klasörüne göre dosya yolu */
  src: string;
  /** Aynı kaynağın videonun başka bir yerinde tekrar kullanılıp kullanılmadığı */
  reused?: boolean;
  /** Tekrar kullanılan klipler için "zaman geçmiş" hissi veren renk varyasyonu */
  colorVariant?: ColorVariant;
  /** Sadece image segmentleri için Ken Burns efekt yönü */
  kenBurns?: KenBurnsDirection;
  /** Ham (kaynak) süre, saniye cinsinden — video için hep 10, görsel için değişken */
  durationInSeconds: number;
  /** Video segmentleri için SLOWDOWN_FACTOR yerine kullanılacak özel oran
   *  (örn. daha kısa ham klipleri final segment süresine tam yaymak için) */
  customPlaybackRate?: number;
}

export const HAM_FPS = 30;
export const SLOWDOWN_FACTOR = 0.667; // playbackRate — ×1.5 yavaşlatma
export const CROSSFADE_FRAMES = 15; // final timeline'da ~0.5s geçiş

// mevcut-b-yakin-portre kaynağı 8sn (240 komp-frame) — 10sn'lik diğer
// klipler gibi FINAL_SEGMENT_FRAMES'i (15sn = 450 frame) tam doldurmak için
// playbackRate = 240/450 ≈ 0.5333 (×1.875 yavaşlatma) gerekiyor.
export const CLOSEUP_B_SLOWDOWN = 240 / 450;

export const segments: Segment[] = [
  // ─── YENİ GİRİŞ ───────────────────────────────────────────────
  {
    id: 1,
    type: 'video',
    label: 'GİRİŞ — İlk bakış, buz altında altın ışıltısı (YENİ-INTRO)',
    src: 'videos/taidula-epic/yeni-intro-acilis.mp4',
    durationInSeconds: 10,
  },
  // ─── AÇILIŞ (mevcut) ──────────────────────────────────────────
  {
    id: 2,
    type: 'video',
    label: 'Donmuş kurgan/mezar çukuru (MEVCUT-A)',
    src: 'videos/taidula-epic/mevcut-a-donmus-mezar.mp4',
    colorVariant: 'cool',
    durationInSeconds: 10,
  },
  {
    id: 3,
    type: 'image',
    label: 'Arkeolojik kazı çalışması',
    src: 'images/taidula-epic/gorsel-01-arkeolojik-kazi.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 16,
  },
  {
    id: 4,
    type: 'image',
    label: 'Saray şehri / Altın Orda haritası',
    src: 'images/taidula-epic/gorsel-02-saray-sehri.jpg',
    kenBurns: 'pan-right',
    durationInSeconds: 20,
  },
  {
    id: 5,
    type: 'image',
    label: "Ülzebek Han'ın tahtı (boş, bağlam)",
    src: 'images/taidula-epic/gorsel-03-ulzebek-tahti.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 16,
  },
  {
    id: 6,
    type: 'video',
    label: 'Taidula ilk tanıtım — yakın portre (MEVCUT-B)',
    src: 'videos/taidula-epic/mevcut-b-yakin-portre.mp4',
    durationInSeconds: 8,
    customPlaybackRate: CLOSEUP_B_SLOWDOWN,
  },
  {
    id: 7,
    type: 'image',
    label: 'Evlilik / saray töreni',
    src: 'images/taidula-epic/gorsel-04-evlilik-toreni.jpg',
    kenBurns: 'pan-left',
    durationInSeconds: 18,
  },
  {
    id: 8,
    type: 'image',
    label: 'Taidula tahtta — resmi statü',
    src: 'images/taidula-epic/gorsel-05-taidula-tahtta.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 18,
  },
  {
    id: 9,
    type: 'video',
    label: 'Mühür töreni (YENİ-1)',
    src: 'videos/taidula-epic/yeni-1-muhur-toreni.mp4',
    durationInSeconds: 10,
  },
  {
    id: 10,
    type: 'image',
    label: 'Venedik/Ceneviz elçileri',
    src: 'images/taidula-epic/gorsel-06-elciler.jpg',
    kenBurns: 'pan-right',
    durationInSeconds: 20,
  },
  {
    id: 11,
    type: 'image',
    label: 'Anlaşma imzalama / belge detayı',
    src: 'images/taidula-epic/gorsel-07-anlasma-imza.jpg',
    kenBurns: 'zoom-out',
    durationInSeconds: 18,
  },
  {
    id: 12,
    type: 'video',
    label: 'Motif tekrarı — yakın portre (MEVCUT-B tekrar)',
    src: 'videos/taidula-epic/mevcut-b-yakin-portre.mp4',
    reused: true,
    colorVariant: 'warm',
    durationInSeconds: 8,
    customPlaybackRate: CLOSEUP_B_SLOWDOWN,
  },
  {
    id: 13,
    type: 'image',
    label: 'Saray bazarı / ticaret rotaları',
    src: 'images/taidula-epic/gorsel-08-bazar-ticaret.jpg',
    kenBurns: 'pan-left',
    durationInSeconds: 20,
  },
  {
    id: 14,
    type: 'image',
    label: 'Kurultay genel görünüş',
    src: 'images/taidula-epic/gorsel-09-kurultay-genel.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 18,
  },
  {
    id: 15,
    type: 'video',
    label: 'Kurultayda konuşma anı (YENİ-2)',
    src: 'videos/taidula-epic/yeni-2-kurultay-konusma.mp4',
    durationInSeconds: 10,
  },
  {
    id: 16,
    type: 'image',
    label: "Ülzebek'in son yılları",
    src: 'images/taidula-epic/gorsel-10-ulzebek-son-yillar.jpg',
    kenBurns: 'zoom-out',
    durationInSeconds: 18,
  },
  {
    id: 17,
    type: 'image',
    label: "Saray'da yas",
    src: 'images/taidula-epic/gorsel-11-saray-yasi.jpg',
    kenBurns: 'pan-up',
    durationInSeconds: 16,
  },
  {
    id: 18,
    type: 'video',
    label: 'Regent anı — geniş portre (MEVCUT-C)',
    src: 'videos/taidula-epic/mevcut-c-genis-portre.mp4',
    durationInSeconds: 10,
  },
  {
    id: 19,
    type: 'image',
    label: 'Devlet istikrarı / süreklilik',
    src: 'images/taidula-epic/gorsel-12-miras-kolaj.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 16,
  },
  {
    id: 20,
    type: 'image',
    label: 'Saray ruinleri, bugün',
    src: 'images/taidula-epic/gorsel-13-saray-ruinleri.jpg',
    kenBurns: 'pan-down',
    durationInSeconds: 18,
  },
  {
    id: 21,
    type: 'image',
    label: 'Arşiv belgeleri + mühür müzede',
    src: 'images/taidula-epic/gorsel-14-arsiv-muhur.jpg',
    kenBurns: 'zoom-out',
    durationInSeconds: 18,
  },
  {
    id: 22,
    type: 'video',
    label: 'Bozkırda silüet — miras (YENİ-3)',
    src: 'videos/taidula-epic/yeni-3-siluet-miras.mp4',
    durationInSeconds: 10,
  },
  {
    id: 23,
    type: 'video',
    label: 'KAPANIŞ — donmuş mezara dönüş (MEVCUT-A tekrar)',
    src: 'videos/taidula-epic/mevcut-a-donmus-mezar.mp4',
    reused: true,
    colorVariant: 'warm',
    durationInSeconds: 10,
  },
  // ─── YENİ SON (OUTRO) ─────────────────────────────────────────
  {
    id: 24,
    type: 'video',
    label: 'SON — yıldızlara dönüş, epilog (YENİ-OUTRO)',
    src: 'videos/taidula-epic/yeni-outro-kapanis.mp4',
    durationInSeconds: 10,
  },
];

// --- Doğrulama ---
export const TOTAL_HAM_SECONDS = segments.reduce(
  (sum, s) => sum + s.durationInSeconds,
  0
);
export const AI_VIDEO_COUNT = segments.filter((s) => s.type === 'video').length; // 10
export const IMAGE_COUNT = segments.filter((s) => s.type === 'image').length; // 14
