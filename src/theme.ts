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

// Sahneler arası crossfade süresi (TransitionSeries.Transition)
export const TRANSITION_DURATION_FRAMES = 15; // 0.625sn

// Video klibi olmayan, sadece metin/grafik ara sahne kartlarının süresi
export const INTERSTITIAL_DURATION_FRAMES = 36; // 1.5sn
