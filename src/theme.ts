// GemVault Pro — Ortak marka sabitleri
// Uygulamanın kendi görsel kimliğinden alınmıştır (gemvault-pro-v5-2.html)

export const COLORS = {
  bgDark: "#060608",
  gold: "#c9a84c",
  goldLight: "#D4AF37",
  turquoise: "#59f2e4",
  ink: "#0e0e12",
  white: "#f5f5f0",
  softGray: "#9a9a9a",
};

export const FONTS = {
  serif: "'Playfair Display', 'Cormorant Garamond', serif",
  mono: "'JetBrains Mono', monospace",
};

// Video ayarları — Flow klipleri 1280x720 24fps olarak geldiği için
// kompozisyonu buna göre ayarlıyoruz. İstersen 1920x1080'e yükseltip
// Flow render'larını upscale ile içeri alabiliriz.
export const VIDEO_CONFIG = {
  width: 1280,
  height: 720,
  fps: 24,
};

// Her sahne 10 saniye = 240 frame (24fps'te) — Reklam 1 klipleri 240 frame
// (tam 10.0sn) olarak geldi, bu yüzden 8sn varsayımından güncellendi.
export const SCENE_DURATION_FRAMES = 10 * VIDEO_CONFIG.fps;

// Çing Hatun belgesel klibi — ayrı format (1920x1080, 30fps, 30sn).
export const CING_HATUN_VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
};

export const CING_HATUN_DURATION_FRAMES = 900; // 30sn @ 30fps

// Dikey (Reels/Shorts/TikTok) versiyon — aynı süre, 9:16 kadraj.
export const CING_HATUN_VERTICAL_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

// "Bozkır Hatunları" serisi — Taidula. Kaynak video 30sn/900 frame ama
// genişletilmiş anlatım (~36.4sn) daha uzun sürdüğü için kapanışta
// freeze ile video, sesle aynı anda biter.
export const TAIDULA_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const TAIDULA_DURATION_FRAMES = 1110; // ~37sn @ 30fps

// "Bozkır Hatunları" serisi — Terken Hatun (Harezmşahlar). Kaynak video
// 30sn/900 frame, genişletilmiş anlatım (~34.6sn) videodan uzun olduğu için
// kapanışta freeze ile video, sesle aynı anda biter.
export const TERKEN_HATUN_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const TERKEN_HATUN_DURATION_FRAMES = 1068; // ~35.6sn @ 30fps

// "Bozkır Hatunları" serisi — Süyümbike Hatun (Kazan Hanlığı). Kaynak video
// 30sn/900 frame, genişletilmiş anlatım (~32.9sn) videodan uzun olduğu için
// kapanışta freeze ile video, sesle aynı anda biter.
export const SUYUMBIKE_HATUN_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const SUYUMBIKE_HATUN_DURATION_FRAMES = 1018; // ~33.9sn @ 30fps

// "Bozkır Hatunları" serisi — Subeşi Cadıları (Tarım Havzası mumyaları).
// Diğer dörtten farklı: hükümdar/güç anlatısı değil, kimliksiz bir gizem —
// ses daha yavaş/alçak, ambiyans sonda tam sessizliğe değil çok düşük bir
// seviyeye iniyor. Kaynak video 30sn/900 frame, anlatım ~35sn.
export const SUBESHI_CADILARI_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const SUBESHI_CADILARI_DURATION_FRAMES = 1080; // 36sn @ 30fps

// ============================================================
// "Örümcek Adam" — Bozkır Hatunları serisinden tamamen ayrı, bağımsız
// bir hobi projesi. Kendi ses/renk mantığı var; seri kapanışı yok.
// ============================================================
export const ORUMCEK_ADAM_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const ORUMCEK_ADAM_DURATION_FRAMES = 880; // ~29.3sn @ 30fps — Uyanış hızlandırılıp kapanışta freeze eklendi

// "Bozkır Hatunları" / Gök Umay serisi — Ukok Prensesi. Aynı Taidula
// klibi (taht/mühür/tower-çöl split-screen) farklı bir anlatımla deneniyor.
// Metin çok daha uzun (13 replik) olduğu için narration (~53sn) videodan
// (30sn) belirgin şekilde uzun sürüyor — kapanışta uzun bir freeze var.
export const UKOK_PRENSESI_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const UKOK_PRENSESI_DURATION_FRAMES = 1710; // 57sn @ 30fps

// "Bozkır Hatunları" / Gök Umay serisi — Loulan Güzeli (Tiebanhe M1).
// Beş Altın Kural'a uyan en "akademik/nötr" tonlu video — seride en yüksek
// stability, en düşük style. Kaynak video 30sn/900 frame; anlatım 2021
// Nature genom çalışmasına atıfla revize edildi (~73sn), sonra ffmpeg
// atempo=1.5 ile 1.5x hızlandırılarak ~48.8sn'ye indirildi — kapanışta
// kısaltılmış bir freeze var (Ukok Prensesi'ndekinden çok daha kısa).
export const LOULAN_GUZELI_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const LOULAN_GUZELI_DURATION_FRAMES = 1489; // ~49.6sn @ 30fps

// "Bozkır Hatunları" / Gök Umay serisi — Loulan Güzeli v2 ("Elleriyle
// Bıraktıkları"). v1'in "kimlik gizemi" açısından farklı olarak "eller ve
// günlük yaşam" açısı — daha sıcak ton (düşük stability / yüksek style).
// Script revize edildi (yün/dokuma teknolojisinin Yakın Doğu kökeni,
// Shishlina 2021 / Wagner 2022 atıflı; "MÖ" kısaltması "milattan önce"
// olarak düzeltildi) ve anlatım artık ~58.1sn. Kapanışta artık sadece
// v2'nin kendi klibi donmuyor — v1'in mezar sahnesine geçiş yapıp onun
// üzerinde donuyor (iki filmi birbirine bağlayan bir kapanış).
export const LOULAN_GUZELI_V2_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const LOULAN_GUZELI_V2_DURATION_FRAMES = 1769; // ~59sn @ 30fps

// "Bozkır Hatunları" / Gök Umay serisi — Berel Hatun (Kurgan 11, Doğu
// Kazakistan, Altay Dağları). Seride ilk kez üç ayrı 10sn Google Flow
// klibi 12 kare crossfade ile birbirine bağlanıyor (tek uzun klip değil).
// Kanca: birlikte gömülen kadın ve erkeğin akraba OLMADIĞININ genetik
// olarak kanıtlanmış olması. Anlatım (~38.3sn) 3 sahnenin toplam süresini
// (30sn) aştığı için üçüncü sahne (dağ manzarası) kendi son karesinde
// donuyor, anlatım bitene kadar ekranda kalıyor. Yüz rekonstrüksiyon
// verisi olmadığı için kapanışta dipnot var (bkz. berelHatunCaptions.ts).
export const BEREL_HATUN_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const BEREL_HATUN_DURATION_FRAMES = 1239; // ~41.3sn @ 30fps

// "Gök Umay" — "1916 Ürkün" (Kırgız halkının Çarlık Rusyası'na karşı
// ayaklanması ve dağlar üzerinden zorunlu göçü). Bozkır Hatunları
// serisinden bağımsız, anma/belgesel formatında bir Reels. Video klip
// yok — 9 statik AI görsel (bazıları kendi üstüne gömülü başlık metniyle
// üretilmiş), 8 sahneye "contain + bulanık zemin" tekniğiyle (bkz.
// StorybookPage) hiç kırpılmadan yerleştiriliyor; sahne 7 iki görsel
// kullanıyor (vadiye dönüş + güncel anma töreni). Sadece görsel + tek
// parça anlatım (~1:40) — müzik/SFX yok (kullanıcı isteği).
export const URKUN_VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const URKUN_DURATION_FRAMES = 3036; // ~101.2sn @ 30fps
