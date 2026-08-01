# GemVault Remotion Projesi

Bu klasör, Flow'dan (Veo 3.1) indirilen ham klipleri birleştirip logo/metin
overlay ekleyerek iki reklamı final MP4 olarak render etmek için hazırlandı.

## ÖNEMLİ — Bu proje burada (claude.ai container) TEST EDİLEMEDİ

Bu ortamın ağ ayarları `registry.npmjs.org` erişimini engelliyor
(`host_not_allowed`), bu yüzden `npm install` burada çalışmadı. Kod
dosyaları tam ve doğru yazıldı ama gerçek `npm install` / `npm start` /
render işlemini kendi bilgisayarında veya Claude Code'da (Pro hesap)
yapman gerekiyor.

## Kurulum (kendi bilgisayarında veya Claude Code'da)

```bash
cd gemvault-remotion
npm install
npm start        # Remotion Studio'yu açar, tarayıcıda önizleme yaparsın
```

## Klip Yerleşimi

Flow'dan indirdiğin MP4 dosyalarını `public/clips/` klasörüne şu isimlerle
koy:

### Reklam 1 (GEMVAULT_REKLAM_PLANI.md ile birebir eşleşir)
```
public/clips/ad1-scene-01.mp4   Kaos
public/clips/ad1-scene-02.mp4   Mavi Beliriyor
public/clips/ad1-scene-03.mp4   Kasa Açılışı
public/clips/ad1-scene-04.mp4   5 Gem Beliriyor
public/clips/ad1-scene-05.mp4   Arayüz Kullanımı: Arama
public/clips/ad1-scene-06.mp4   AI Üretici / Mavi'nin Enerjisi
public/clips/ad1-scene-07.mp4   Dönüşüm
public/clips/ad1-scene-08.mp4   Birlikte Zafer
public/clips/ad1-scene-09.mp4   Logo Kapanışı (logo overlay burada eklenir)
```

### Reklam 2 (GEMVAULT_REKLAM2_MOLO_PLANI.md ile birebir eşleşir)
```
public/clips/ad2-scene-01.mp4   Molo - Prompt Çilesi
public/clips/ad2-scene-02.mp4   Molo - Manuel Arama Kaosu
public/clips/ad2-scene-03.mp4   Molo - İnatçı Ret
public/clips/ad2-scene-04.mp4   Defne - Kolaylık
public/clips/ad2-scene-05.mp4   Defne - Bitti Bile
public/clips/ad2-scene-06a.mp4  Split-screen SOL (Molo loop)
public/clips/ad2-scene-06b.mp4  Split-screen SAĞ (Defne loop)
public/clips/ad2-scene-07.mp4   Logo Kapanış + Molo cameo
```

**Sahne 6 notu:** Önce Flow'da TEK klip olarak "split-screen" promptunu
dene (bkz plan dosyasındaki prompt). Sonuç iyi çıkarsa dosyayı
`ad2-scene-06.mp4` olarak kaydet ve `src/scenes/GemVaultAd2.tsx` içinde
`<SplitScreenCompare>` bloğunu yorum satırındaki `<RawClip
src="clips/ad2-scene-06.mp4" />` ile değiştir. Sonuç tutarsızsa (karakterler
kayıyor, oranlar bozuluyor vb.), mevcut kod zaten iki ayrı klibi
(06a solda Molo, 06b sağda Defne) otomatik yan yana kompoze ediyor —
hiçbir değişiklik gerekmez, sadece iki dosyayı doğru isimle koy.

## Render Alma

```bash
npm run build:ad1    # out/gemvault-ad1.mp4 üretir
npm run build:ad2    # out/gemvault-ad2.mp4 üretir
```

## Klip Süreleri Farklıysa

Flow klipleri bazen tam 8.00sn değil, 7.8sn veya 8.2sn gibi gelebilir.
Bu durumda `src/scenes/GemVaultAd1.tsx` ve `GemVaultAd2.tsx` içindeki
`SCENE_DURATION_FRAMES` sabitini (şu an `src/theme.ts` içinde 24fps x 8sn
= 192 frame olarak tanımlı) sahne bazlı override edebilirsin — her
`Sequence`'in `durationInFrames` değerini o sahnenin gerçek frame sayısıyla
değiştirmen yeterli.

## Dosya Yapısı

```
src/
  index.ts              Remotion giriş noktası
  Root.tsx              İki kompozisyonu (Ad1, Ad2) kaydeder
  theme.ts               Marka renkleri, fontlar, video ayarları
  components/
    RawClip.tsx           Flow klibini oynatan temel bileşen
    Overlays.tsx           Logo wordmark + alt yazı bileşenleri
    SplitScreenCompare.tsx Sahne 6 için split-screen kompozisyonu
  scenes/
    GemVaultAd1.tsx        Reklam 1 — 9 sahne, tam kompozisyon
    GemVaultAd2.tsx         Reklam 2 — 7 sahne, tam kompozisyon
public/
  clips/                  Flow'dan indirilen ham MP4'lerin konulacağı yer
```

## Sonraki Adımlar
1. Flow'da tüm klipleri üret, `public/clips/` içine doğru isimlerle koy.
2. `npm install && npm start` ile Remotion Studio'da önizle.
3. Gerekirse `Overlays.tsx` içindeki metinleri (slogan, tagline) düzenle.
4. `npm run build:ad1` ve `npm run build:ad2` ile final MP4'leri al.

## Çing Hatun — Belgesel Klibi (`ChingHatun` kompozisyonu)

30 saniyelik, 1920x1080/30fps belgesel klip. `Cing_Hatun_Remotion_Yapim_Talimati.txt`
talimatındaki tek parça anlatım/ambiyans/alt yazı mantığı burada uygulandı:

```
public/
  videos/cinghatun-ilk-sahne.mp4   Flow'dan gelen ham görüntü (ses mute edildi)
  audio/narration.mp3               ElevenLabs "Deniz - Calm Narrator" ile üretildi
  audio/ambient_wind_fire.mp3       ElevenLabs Sound Effects — bozkır/ateş/rüzgar loop (~22sn)
src/
  data/chingHatunCaptions.ts        ElevenLabs word-level alignment'ından türetilen alt yazı zamanlamaları
  components/ColorGrade.tsx         Ortak sıcak ton + vinyet + film grain wrapper'ı
  components/Captions.tsx           Zaman kodlu alt yazı katmanı (6 frame fade)
  scenes/ChingHatun.tsx             Ana kompozisyon: video mute + narration + ambiyans + son 30 frame freeze/fade-out
```

Render:
```bash
npm run build:cinghatun   # out/cinghatun.mp4 üretir
```

**Not:** Talimat dosyasında 3 ayrı sahne (scene1/2/3) + iki crossfade geçişi tarif
ediliyor; şu an sadece "İlk Sahne" klibi mevcut ve tam 30sn olduğu için tek parça
görüntü olarak kullanıldı. scene2/scene3 klipleri gelince `ChingHatun.tsx` içindeki
video katmanı 3 ayrı `<OffthreadVideo>` + 12 frame crossfade yapısına bölünebilir.
