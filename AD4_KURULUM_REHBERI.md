# Reklam 4 — Kurulum Rehberi

## 1. Video Dosyaları (public/clips/)
```
ad4-scene-01.mp4 ... ad4-scene-07.mp4   Luma'dan, hepsi 5sn — YENİ
ad1-scene-09.mp4                         zaten var — REUSE (kapanış)
```
Sahne sırası: 01 Geliştirici · 02 Sağlık Koçu · 03 İçerik Üreticisi ·
04 Molo (mola) · 05 Strateji · 06 Hukuk/İş · 07 Eğitimci — hepsi Defne,
sadece 04 Molo.

## 2. Ses Dosyaları (public/audio/{tr,en}/)
```
ad4-scene-01.mp3 ... ad4-scene-07.mp3   Montaj sahneleri (7 satır)
ad4-grid.mp3                             Grid anı: "Fark etmez —
                                          GemVault her işinde yanında."
ad4-close.mp3                            Kapanış — YENİ metin:
                                          "GemVault Pro. Hemen indir —
                                          App Store ve Web'de."
```
Toplam: 18 yeni ses dosyası (9 TR + 9 EN). Tam metinler
`planning/GEMVAULT_REKLAM4_PLAN_V2.md` dosyasında.

## 3. Yapı Özeti
- 0-35sn: Montaj — Defne 6 meslek + Molo (4. sırada) mola, her sahne 5sn
- 35-43sn: Grid anı — 6 Defne klibi (Molo hariç) aynı anda 2x3 panelde
- 43-51sn: Kapanış — Ad1'in logo klibi reuse, yeni ses + LogoWordmark

## 4. Süre Kontrolü
Luma klipleri 5sn hedefiyle geldi. ffprobe ile ölç, sapma varsa
`GemVaultAd4.tsx`'teki `montageScenes` dizisini ve `Root.tsx`'teki
`AD4_DURATION` toplamını güncelle.

## 5. Önizleme ve Render
```bash
npm start
npm run build:ad4-tr
npm run build:ad4-en
```

## Not — Grid Panelinde Ses
`GridReveal` her paneli sessiz oynatıyor (volume 0) — o anın tek sesi
ortak voiceover (ad4-grid.mp3), panellerin kendi sesleri karışıp
kakofoni yaratmasın diye.
