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

export const ORUMCEK_ADAM_DURATION_FRAMES = 900; // 30sn @ 30fps
