/**
 * TAIDULA — "Buz Altında Bir Hükümdar"
 * 20 segment × 10s ham = 200s ham → ×1.5 yavaşlatma → ~290s final
 * 8 AI video kullanımı (6 benzersiz klip) + 12 statik görsel
 *
 * Kaynak klipler yatay (1280x720) AI üretimi — dikey deneme klipleri terk
 * edildi. "mevcut-b-yakin-portre" kaynağı sadece 8sn (diğerleri 10sn) —
 * bu yüzden segment 5 ve 11 (aynı klibi kullanan iki segment) için
 * standarttan daha güçlü bir yavaşlatma uygulanıyor (bkz. CLOSEUP_B_SLOWDOWN),
 * böylece 8sn'lik ham içerik yine de 15sn'lik final segment süresini
 * (FINAL_SEGMENT_FRAMES) tam doldurur.
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
  /** Ham (kaynak) süre, saniye cinsinden — bilgilendirme amaçlı */
  durationInSeconds: number;
  /** Video segmentleri için SLOWDOWN_FACTOR yerine kullanılacak özel oran
   *  (örn. daha kısa ham klipleri final segment süresine tam yaymak için) */
  customPlaybackRate?: number;
}

export const HAM_FPS = 30;
export const SLOWDOWN_FACTOR = 0.667; // playbackRate — video/segment süresini ×1.5 uzatır
export const CROSSFADE_FRAMES = 15; // final timeline'da ~0.5s geçiş

// mevcut-b-yakin-portre kaynağı 8sn (240 komp-frame'i değil, 8*30=240 frame)
// — HAYIR: 8s * 30fps = 240 frame ham içerik. FINAL_SEGMENT_FRAMES=450'yi tam
// doldurmak için playbackRate = 240/450 ≈ 0.5333 (×1.875 yavaşlatma).
export const CLOSEUP_B_SLOWDOWN = 240 / 450;

export const segments: Segment[] = [
  {
    id: 1,
    type: 'video',
    label: 'AÇILIŞ — Donmuş kurgan/mezar çukuru (MEVCUT-A)',
    src: 'videos/taidula-epic/mevcut-a-donmus-mezar.mp4',
    colorVariant: 'cool',
    durationInSeconds: 10,
  },
  {
    id: 2,
    type: 'image',
    label: 'Arkeolojik kazı çalışması',
    src: 'images/taidula-epic/gorsel-01-arkeolojik-kazi.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 10,
  },
  {
    id: 3,
    type: 'image',
    label: 'Saray şehri / Altın Orda haritası',
    src: 'images/taidula-epic/gorsel-02-saray-sehri.jpg',
    kenBurns: 'pan-right',
    durationInSeconds: 10,
  },
  {
    id: 4,
    type: 'image',
    label: "Ülzebek Han'ın tahtı (boş, bağlam)",
    src: 'images/taidula-epic/gorsel-03-ulzebek-tahti.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 10,
  },
  {
    id: 5,
    type: 'video',
    label: 'Taidula ilk tanıtım — yakın portre (MEVCUT-B)',
    src: 'videos/taidula-epic/mevcut-b-yakin-portre.mp4',
    durationInSeconds: 8,
    customPlaybackRate: CLOSEUP_B_SLOWDOWN,
  },
  {
    id: 6,
    type: 'image',
    label: 'Evlilik / saray töreni',
    src: 'images/taidula-epic/gorsel-04-evlilik-toreni.jpg',
    kenBurns: 'pan-left',
    durationInSeconds: 10,
  },
  {
    id: 7,
    type: 'image',
    label: 'Taidula tahtta — resmi statü',
    src: 'images/taidula-epic/gorsel-05-taidula-tahtta.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 10,
  },
  {
    id: 8,
    type: 'video',
    label: 'Mühür töreni (YENİ-1)',
    src: 'videos/taidula-epic/yeni-1-muhur-toreni.mp4',
    durationInSeconds: 10,
  },
  {
    id: 9,
    type: 'image',
    label: 'Venedik/Ceneviz elçileri',
    src: 'images/taidula-epic/gorsel-06-elciler.jpg',
    kenBurns: 'pan-right',
    durationInSeconds: 10,
  },
  {
    id: 10,
    type: 'image',
    label: 'Anlaşma imzalama / belge detayı',
    src: 'images/taidula-epic/gorsel-07-anlasma-imza.jpg',
    kenBurns: 'zoom-out',
    durationInSeconds: 10,
  },
  {
    id: 11,
    type: 'video',
    label: 'Motif tekrarı — yakın portre (MEVCUT-B tekrar)',
    src: 'videos/taidula-epic/mevcut-b-yakin-portre.mp4',
    reused: true,
    colorVariant: 'warm',
    durationInSeconds: 8,
    customPlaybackRate: CLOSEUP_B_SLOWDOWN,
  },
  {
    id: 12,
    type: 'image',
    label: 'Saray bazarı / ticaret rotaları',
    src: 'images/taidula-epic/gorsel-08-bazar-ticaret.jpg',
    kenBurns: 'pan-left',
    durationInSeconds: 10,
  },
  {
    id: 13,
    type: 'image',
    label: 'Kurultay genel görünüş',
    src: 'images/taidula-epic/gorsel-09-kurultay-genel.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 10,
  },
  {
    id: 14,
    type: 'video',
    label: 'Kurultayda konuşma anı (YENİ-2)',
    src: 'videos/taidula-epic/yeni-2-kurultay-konusma.mp4',
    durationInSeconds: 10,
  },
  {
    id: 15,
    type: 'image',
    label: "Ülzebek'in son yılları",
    src: 'images/taidula-epic/gorsel-10-ulzebek-son-yillar.jpg',
    kenBurns: 'zoom-out',
    durationInSeconds: 10,
  },
  {
    id: 16,
    type: 'image',
    label: "Saray'da yas",
    src: 'images/taidula-epic/gorsel-11-saray-yasi.jpg',
    kenBurns: 'pan-up',
    durationInSeconds: 10,
  },
  {
    id: 17,
    type: 'video',
    label: 'Regent anı — geniş portre (MEVCUT-C)',
    src: 'videos/taidula-epic/mevcut-c-genis-portre.mp4',
    durationInSeconds: 10,
  },
  {
    id: 18,
    type: 'image',
    label: 'İstikrar + ruinler + arşiv (kolaj)',
    src: 'images/taidula-epic/gorsel-12-miras-kolaj.jpg',
    kenBurns: 'zoom-in',
    durationInSeconds: 10,
  },
  {
    id: 19,
    type: 'video',
    label: 'Bozkırda silüet — miras (YENİ-3)',
    src: 'videos/taidula-epic/yeni-3-siluet-miras.mp4',
    durationInSeconds: 10,
  },
  {
    id: 20,
    type: 'video',
    label: 'KAPANIŞ — donmuş mezara dönüş (MEVCUT-A tekrar)',
    src: 'videos/taidula-epic/mevcut-a-donmus-mezar.mp4',
    reused: true,
    colorVariant: 'warm',
    durationInSeconds: 10,
  },
];

// --- Doğrulama (build sırasında konsola yazdırılabilir) ---
export const TOTAL_HAM_SECONDS = segments.reduce(
  (sum, s) => sum + s.durationInSeconds,
  0
);
export const AI_VIDEO_COUNT = segments.filter((s) => s.type === 'video').length; // 8
export const IMAGE_COUNT = segments.filter((s) => s.type === 'image').length; // 12
