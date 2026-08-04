# BOZKIRIN UYANIŞI — Genişletilmiş Üretim Planı (v2, ~9:30)

Bu doküman, mevcut 4:55'lik "PDF sayfaları + seslendirme" kurgusunun
12 statik sahne, 3 AI video ve ses tasarımı katmanlarıyla **~9 dakika 30
saniyeye** genişletilmesi planıdır.

---

## 1. SÜRE MATEMATİĞİ

| Bileşen | Adet | Süre | Toplam |
|---|---|---|---|
| Kapak (sayfa 1) | 1 | 5 sn | 5 sn |
| Anlatımlı kitap sayfaları (2–10) | 9 | — | 284,8 sn |
| Manzara ara sahneleri (müzik-only) | 8 | ~25 sn | 200 sn |
| Karakter ara sahneleri (kısa kesme) | 4 | ~12 sn | 48 sn |
| Google Flow AI video | 3 | 10 sn | 30 sn |
| Arka kapak (sayfa 11) | 1 | 5 sn | 5 sn |
| **TOPLAM** | | | **~572,8 sn ≈ 9:32** |

Üretilen müzik yatağı **570 sn (9:30)** — yapıyla birebir örtüşüyor.

> **Not:** 12 dakikaya çıkmak teknik olarak mümkün ama ara sahneleri
> 20 sn'den 35 sn'ye uzatmak gerekir. 5–7 yaş için 12 × 35 sn = 7 dakika
> konuşmasız görüntü demek; dikkat süresi açısından riskli buluyorum.
> 12 dakika şartsa daha sağlıklı yol: Senaryolar dosyasındaki **bilimsel
> "Bozkırın Uyanışı" metnini** (mevsimler / dünyanın eğikliği / tohumlar)
> Türkçeye uyarlayıp ikinci bir anlatım katmanı olarak eklemek. Böylece
> süre konuşmayla dolar, sessiz boşlukla değil.

---

## 2. 12 GÖRSELİN YERLEŞİMİ — AKIL YÜRÜTME

### Önce bir tespit

Gönderdiğin 12 promptun **8'i manzara ağırlıklı**, **4'ü karakter/nesne
yakın çekimi**. "Ara sahnelerde sadece tarihi ve doğal yerler görünsün,
tempo düşsün" isteğinle bu 4 tanesi çelişiyor. Önerim ikisini ayırmak:

- **Manzara olanlar (1, 3, 5, 6, 9, 10, 11, 12)** → uzun, müzik-only
  ara sahneler. Tempo burada düşer, anlatım susar.
- **Karakter olanlar (2, 4, 7, 8)** → kısa kesmeler. Bunları müzik-only
  yapmak yerine ilgili anlatım cümlesinin **üstüne** koyuyorum; böylece
  hem karakter takibi kopmuyor hem de "sessiz kısımlar sadece doğa" kuralı
  korunuyor.

### Yerleşim tablosu

| # | Görsel | Tip | Nereye | Neden |
|---|---|---|---|---|
| 1 | Kurşuni Bozkır ve Yalnızlık | 🏔 Manzara | **Kapaktan hemen sonra**, anlatım başlamadan | Hikâyenin "ölü bozkır" halini kurar. Anlatım "Çok uzun zaman önce…" derken izleyici o boşluğu zaten görmüş olur. |
| 2 | Umay ve Kağan'ın Hüznü | 👤 Karakter | Sayfa 2 içinde, *"Toprak ana çok yorgun"* repliğinde | Çadır içi yakın çekim, kitabın geniş planına duygusal bir yakınlaşma verir. |
| 3 | Gök Yüzüne Çağrı | 🏔 Manzara | Sayfa 2 → 3 **arasında** | Bulutların yarılması. AI Video #1'in önüne kurulum karesi olur. |
| 4 | Turul Kuşu'nun Heybeti | 👤 Karakter | Sayfa 3 içinde, *"Bu, efsanevi Turul Kuşu'ydu!"* anında | Kitapta Turul uzakta; bu kare onu yakından tanıtır, çocuk için "kahraman girişi". |
| 5 | Kutsal Vadiye Uçuş | 🏔 Manzara | Sayfa 3 → 4 **arasında** | Uçuş yolculuğu kitapta atlanıyor; bu boşluğu doldurur, coğrafya hissi verir. |
| 6 | Kadim Sunak ve Davul | 🏔 Manzara/Tarihî | Sayfa 4 **başında** | Dikili taşlar + tamgalar = istediğin "tarihî yer" karesi. Vadiyi tanıtır. |
| 7 | Davulu Keşif | 👤 Nesne | Sayfa 4 sonu, davul tarif edilirken | Davulun dokusu/sembolleri; vuruş öncesi merak biriktirir. |
| 8 | Umay'ın Ninnisi | 👤 Karakter | Sayfa 5 içinde, *"kadim bozkır ninnisini söylemeye başladı"* | Vuruştan sonra, dönüşüm öncesi duygusal zirve. |
| 9 | Baharın İlk Çiçeği | 🏔 Doğa (makro) | Sayfa 6 → 7 **arasında** | Tohum→çiçek geçişinin ilk kanıtı. AI Video #2'nin hemen ardına. |
| 10 | Çiçeklenen Bozkır Dansı | 🏔 Manzara | Sayfa 7 → 8 **arasında** | "Kilim gibi kaplanan bozkır"ın geniş karşılığı; en neşeli müzik anı. |
| 11 | Yılkı Atlarının Dönüşü | 🏔 Manzara | Sayfa 8 → 9 **arasında** | Atların özgürlüğü; AI Video #3 (buz kırılması) öncesi nefes. |
| 12 | Şafak ve Sonsuz Bahar | 🏔 Manzara | Sayfa 10 → arka kapak **arasında** | Huzurlu kapanış. Müzik solo kalır, ninni finali burada çalar. |

### Ortaya çıkan ritim

```
Kapak → [1 manzara] → S2(+2) → [3 manzara] → AI#1 → S3(+4) → [5 manzara]
→ [6 manzara] → S4(+7) → S5(+8) → S6 → AI#2 → [9 doğa] → S7
→ [10 manzara] → S8 → [11 manzara] → AI#3 → S9 → S10 → [12 manzara] → Arka kapak
```

Anlatım-yoğun bölümlerle sessiz-manzara bölümleri sırayla geliyor;
5–7 yaş için "izle → dinlen → izle" döngüsü kuruluyor.

---

## 3. GOOGLE FLOW — AI VİDEO PROMPTLARI

Üçünde de **karakter yok** (ya da silüet) — böylece Flow'un karakter
tutarsızlığı riski ortadan kalkıyor, kitabın çizimleriyle çakışmıyor.

### Ortak teknik ek (her promptun sonuna)

```
16:9 horizontal, cinematic slow motion, children's fairytale illustration
aesthetic blended with photoreal lighting, warm amber gold and turquoise
color palette, Central Asian steppe, soft magical atmosphere, no text,
no watermark, no people speaking, no dialogue, no music.
```

### AI Video #1 — Bulutların Yarılması (Sayfa 2→3 geçişi, 10 sn)

```
Heavy dark grey storm clouds over a vast empty steppe suddenly splitting
open down the middle, brilliant golden and copper light bursting through
the tear and pouring down onto the barren frozen ground below. Dust and
ice crystals catch the light as warmth spreads across the earth. The
camera slowly tilts upward toward the opening while pushing gently in.
Epic, awe-inspiring, hopeful.
```
**Kamera:** Tilt-up + yavaş push-in. **SFX:** `kanat-cirpma` + rüzgar yükselmesi.

### AI Video #2 — Tohumların Dönüşümü (Sayfa 6→7 geçişi, 10 sn)

```
Cinematic macro timelapse at ground level: glowing golden seeds falling
onto cold dry steppe earth, each one flaring with light on impact and
instantly sprouting into vivid turquoise, purple and yellow fantasy
flowers that unfurl and spread outward across the frame in a rushing
wave, magical sparkling pollen drifting in warm golden hour sunlight.
```
**Kamera:** Yer hizası makro tracking. **SFX:** `kus-civiltisi` girişi + arp yükselişi.

### AI Video #3 — Buzların Kırılması (Sayfa 8→9 geçişi, 10 sn)

```
A wide frozen river on the open steppe cracking violently open, thick
sheets of ice splintering and tilting as bright turquoise meltwater
surges through and rushes downstream in slow motion, spray catching the
spring sunlight, snow-capped mountains on the horizon, flock of cranes
crossing the blue sky high above in V formation.
```
**Kamera:** Alçak açı, nehir akışını takip eden pan. **SFX:** `buz-kirilma` + `turna-cigligi`.

### (Opsiyonel) AI Video #4 — Yılkı Atları

```
A herd of wild steppe horses led by a luminous white stallion galloping
in slow motion across an endless meadow carpeted with turquoise and
golden wildflowers, manes and tails streaming, dust and petals kicked up
into shafts of low golden sunlight, felt yurts of a nomad camp small on
the far horizon.
```
**Kamera:** Yandan takip + geriye açılma. **SFX:** `at-nal-sesi`.

---

## 4. HAZIR OLAN SES VARLIKLARI (ElevenLabs ile üretildi)

### Müzik
- `public/audio/bozkirin-uyanisi-muzik-uzun.mp3` — **570 sn (9:30)**,
  yeni yapının tamamını kapsıyor. Soğuk/yalnız açılış → mistik davul ve
  vokal → neşeli çiçeklenme → görkemli doruk → ninni kapanış.
- `public/audio/bozkirin-uyanisi-muzik.mp3` — eski 295 sn'lik sürüm
  (mevcut kısa kurguda kullanılıyor).

### Ses efektleri — `public/audio/sfx/`
| Dosya | Süre | Kullanım |
|---|---|---|
| `davul-gum.mp3` | 4,0 sn | **"GÜM!"** — sayfa 5, tek büyük vuruş. O anda müzik tamamen kesilir. |
| `davul-gum-triple.mp3` | 8,0 sn | İkinci ve üçüncü vuruş dizisi |
| `ruzgar-soguk.mp3` | 20,0 sn | Açılış, ölü bozkır (loop'lanabilir) |
| `kanat-cirpma.mp3` | 5,0 sn | Turul'un inişi |
| `buz-kirilma.mp3` | 8,0 sn | AI Video #3 |
| `at-nal-sesi.mp3` | 8,0 sn | Yılkı atları |
| `turna-cigligi.mp3` | 8,0 sn | Turnalar |
| `kus-civiltisi.mp3` | 20,0 sn | Bahar / kutlama (loop'lanabilir) |

### Ses miksaj kuralları
- Anlatım varken müzik **%25**, anlatım yokken (12 ara sahne) **%65**.
- `davul-gum` çaldığı 1 saniye boyunca müzik **%0**'a iner, sonra yükselir.
- SFX katmanı müziğin altında **%15–20**.

---

## 5. REFERANS GÖRSELLER — `reference/bozkirin-uyanisi/`

12 görseli ürettirirken karakter/mekân tutarlılığı için PDF'ten kırpıldı:

| Dosya | İçerik |
|---|---|
| `ref-umay-kagan-tamboy.jpg` | Umay + Kağan tam boy, kostüm detayları |
| `ref-umay-kagan-yuz.jpg` | İkisinin yüz yakın çekimi |
| `ref-turul-1.jpg` | Turul kuşu — iniş anı |
| `ref-turul-2.jpg` | Turul kuşu — kayada, tüy/mücevher detayı |
| `ref-kutsal-vadi-sunak.jpg` | Dikili taşlar, tamgalar, davul sunağı |
| `ref-oba-bozkir.jpg` | Oba, keçe çadırlar, bozkır |
| `ref-cicekli-bozkir.jpg` | Çiçeklenmiş bozkır, renk paleti |
| `ref-kapak-stil.jpg` | Genel stil ve renk paleti (kapak) |

**Karakter tanımı (promptlara eklenecek):**
> Umay: young girl, fur-trimmed pointed hat with pom-pom, two long dark
> braids, red and gold embroidered kaftan over a brown vest, turquoise
> trim. Kağan: young boy, messy dark brown hair, teal blue fur-cuffed
> tunic, wide mustard-yellow sash belt with a round metal buckle.

---

## 6. SIRADAKİ ADIMLAR

1. **Sen:** 12 görseli üret (promptlar + yukarıdaki referans/karakter tanımı).
2. **Sen:** 3 (veya 4) Google Flow videosunu üret.
3. **Ben:** Anlatım mp3'ünü 9 sayfa klibine bölüp yeni mutlak zaman
   çizelgesine yerleştiririm (ara sahneler anlatımı kesmeyecek şekilde).
4. **Ben:** 12 görsel + 3 video + uzun müzik + SFX katmanını kurar,
   ducking ve "GÜM" kesmesini bağlarım.
5. **Ben:** Render + ön izleme.
