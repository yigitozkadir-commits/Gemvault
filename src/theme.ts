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

// Reklam 3 Viral kesim için DİKEY (9:16) format — Luma'dan bu oranda
// üretildi. Ad1/Ad2/Ad3-Hero hep yatay (16:9) kalıyor, bu sadece Viral
// kesime özel.
export const VIDEO_CONFIG_VERTICAL = {
  width: 720,
  height: 1280,
  fps: 24,
};

// Saniyeyi frame'e çevirir (24fps sabit). Ad3'te sahne süreleri sabit
// değil (Luma 5sn/10sn, Flow 8sn, reuse edilenler 8sn) — bu yüzden Ad3
// kompozisyonlarında SCENE_DURATION_FRAMES yerine bu fonksiyonla
// sahne-bazlı süre giriliyor.
export const sec = (seconds: number) => Math.round(seconds * VIDEO_CONFIG.fps);
