# Reklam 3 — Kurulum Rehberi (Viral + Hero)

## 1. Video Dosyalarını Yerleştir

### Viral kesim (public/clips/)
```
ad3v-scene-01.mp4   Gruba Katıl Ritüeli    (Luma, 9:16)
ad3v-scene-02.mp4   Boşluk                 (Luma, 9:16)
ad3v-scene-03.mp4   GemVault Anında        (Luma, 9:16)
```

### Hero kesim (public/clips/)
```
ad3h-scene-01.mp4   Gruba Katıl            (Luma, 16:9)  — YENİ
ad3h-scene-02.mp4   Hayal Kırıklığı        (Luma, 16:9)  — YENİ
ad3h-scene-03.mp4   Kilitli Kapı Metaforu  (Luma, 16:9)  — YENİ
ad1-scene-03.mp4    Kasa Açılışı           (zaten var)   — REUSE
ad3h-scene-05.mp4   AI Gem Üretici, Defne  (Flow, 16:9)  — YENİ
ad1-scene-08.mp4    Birlikte Zafer         (zaten var)   — REUSE
ad1-scene-04.mp4    5 Gem Beliriyor        (zaten var)   — REUSE
ad1-scene-09.mp4    Logo Kapanışı          (zaten var)   — REUSE
```
Reuse edilen 4 dosya için hiçbir şey yapmana gerek yok — zaten Reklam
1'i render ederken `public/clips/` içine koymuştun, aynı yerde kalıyor.
Kod otomatik olarak `ad1-scene-XX.mp4` dosyalarını çağırıyor.

## 2. Ses Dosyalarını Yerleştir — DİKKAT

**Reuse edilen sahnelerin bile sesi YENİ üretilmeli.** Video görüntüsü
Reklam 1'den geliyor ama Reklam 3'ün kendi (farklı) metni var.
Ad1'in ses dosyalarını buraya kopyalama — GEMVAULT_TUM_SESLER_ICTEN_V3.md
dosyasındaki "REKLAM 3 — HERO KESİM" bölümündeki metinleri kullanarak
ElevenLabs'te sıfırdan üret.

```
public/audio/tr/ad3v-scene-01.mp3 ... ad3v-scene-03.mp3   (Viral, 3 dosya)
public/audio/en/ad3v-scene-01.mp3 ... ad3v-scene-03.mp3

public/audio/tr/ad3h-scene-01.mp3 ... ad3h-scene-08.mp3   (Hero, 8 dosya)
public/audio/en/ad3h-scene-01.mp3 ... ad3h-scene-08.mp3
```
Toplam: 22 yeni ses dosyası (11 TR + 11 EN).

## 3. Süre Kontrolü (ÖNEMLİ)

Kod, her sahne için TAHMİNİ süre kullanıyor (Viral: 5sn sabit, Hero:
H1-H3 10sn, H5 8sn, reuse edilenler 8sn). Gerçek AI çıktıları bu
sürelerden sapabilir. Render almadan önce her klibi ölç:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/clips/ad3v-scene-01.mp4
```

Sapma varsa, ilgili dosyada `scenes` dizisindeki `duration` değerini
(saniye cinsinden) güncelle:
- `src/scenes/GemVaultAd3Viral.tsx`
- `src/scenes/GemVaultAd3Hero.tsx`

Ayrıca `src/Root.tsx` içindeki `AD3_VIRAL_DURATION` ve
`AD3_HERO_DURATION` toplamlarını da güncellenen sürelere göre elle
düzelt (bu ikisi otomatik hesaplanmıyor, sahne sürelerinin toplamı elle
girildi).

## 4. Önizleme ve Render

```bash
npm start
# Remotion Studio'da soldaki listeden şunları seç ve önizle:
#   GemVaultAd3Viral-TR / GemVaultAd3Viral-EN
#   GemVaultAd3Hero-TR / GemVaultAd3Hero-EN

npm run build:ad3v-tr   # out/gemvault-ad3-viral-tr.mp4
npm run build:ad3v-en   # out/gemvault-ad3-viral-en.mp4
npm run build:ad3h-tr   # out/gemvault-ad3-hero-tr.mp4
npm run build:ad3h-en   # out/gemvault-ad3-hero-en.mp4
```

## 5. Kapanış Detayları

- Viral kesim, son sahnede (V3) alt yazı olarak CTA gösteriyor: "GemVault
  Pro — Hemen İndir" / "Download Now".
- Hero kesim, son sahnede (H8, reuse edilen logo klip) hem
  LogoWordmark hem "Bu daha başlangıç" / "This is just the beginning"
  etiketi gösteriyor — Skills Vault / Repo Vault gibi gelecek ürünlere
  isim vermeden hafif bir gönderme.
