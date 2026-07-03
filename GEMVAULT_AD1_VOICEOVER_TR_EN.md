# GemVault Pro — Reklam 1 Voiceover Metni (TR + EN)

Gemini analizine göre eklenen düzeltmeler:
- Açılış mesajı artık sese de taşınıyor (ekran metnine bağımlılık azaldı)
- "735 Gem, 18 Kategori" rakamı sesle güçlendirildi (UI'ın kendisi kısa
  göründüğü için bilgiyi sesle telafi ediyoruz)
- Kapanışta net CTA: "Hemen İndir" + platform
- Ton: nötr/dengeli — hem bireysel kullanıcıya hem profesyonele hitap eder

Zamanlama: her sahne 8sn. Voiceover cümleleri sahne başına ~2.5-3.5 saniye
konuşma süresine sığacak şekilde kısa tutuldu (TTS'te ortalama okuma hızı
~2.5 kelime/sn baz alındı), geri kalan süre sahnenin görsel nefes alma
payı olarak bırakıldı.

---

## SAHNE 1 — Kaos (0-8sn)
🇹🇷 TR: "Onlarca sekme. Kaybolan fikirler. Tanıdık geliyor mu?"
🇬🇧 EN: "Dozens of tabs. Lost ideas. Sound familiar?"

## SAHNE 2 — Mavi Beliriyor (8-16sn)
🇹🇷 TR: "GemVault Pro burada — yapay zekayı ustaca kullanmanın yolu."
🇬🇧 EN: "Meet GemVault Pro — your smarter way to work with AI."

## SAHNE 3 — Kasa Açılışı (16-24sn)
🇹🇷 TR: "735 uzman talimat, tek bir kasada seni bekliyor."
🇬🇧 EN: "735 expert prompts, waiting inside a single vault."

## SAHNE 4 — 5 Gem Beliriyor (24-32sn)
🇹🇷 TR: "Strateji, kod, sağlık, sosyal medya — 18 kategoride, her ihtiyaca bir Gem."
🇬🇧 EN: "Strategy, code, health, social media — 18 categories, a Gem for everything."

## SAHNE 5 — Arayüz Kullanımı: Arama (32-40sn)
🇹🇷 TR: "Ara, bul, kullan. Saniyeler içinde."
🇬🇧 EN: "Search, find, use. In seconds, not hours."

## SAHNE 6 — AI Üretici / Mavi'nin Enerjisi (40-48sn)
🇹🇷 TR: "İhtiyacın özelse, kendi Gem'ini yapay zekayla anında üret."
🇬🇧 EN: "Need something custom? Generate your own Gem instantly with AI."

## SAHNE 7 — Dönüşüm (48-56sn)
🇹🇷 TR: "Karmaşa yerini netliğe bırakıyor."
🇬🇧 EN: "Chaos gives way to clarity."

## SAHNE 8 — Birlikte Zafer (56-64sn)
🇹🇷 TR: "Artık yalnız değilsin — GemVault yanında."
🇬🇧 EN: "You're not doing this alone anymore — GemVault's got you."

## SAHNE 9 — Logo Kapanışı / CTA (64-72sn)
🇹🇷 TR: "GemVault Pro. Hemen indir, App Store ve Web'de seni bekliyor."
🇬🇧 EN: "GemVault Pro. Download now — on the App Store and the Web."

---

## Prodüksiyon Notları

**TTS için:** Her satırı ayrı ayrı seslendirip (ElevenLabs veya benzeri),
Descript'te ilgili Flow klibinin üzerine hizalayabilirsin. Descript'in
"prompt_project_agent" özelliğiyle "bu sesi şu klibe senkronla" gibi doğal
dil komutlarıyla da hızlandırabilirsin.

**İki ayrı final video için:**
- `gemvault-ad1-TR.mp4` — TR ses katmanı + aynı 9 görsel klip
- `gemvault-ad1-EN.mp4` — EN ses katmanı + aynı 9 görsel klip

**Remotion tarafında yapılacak:** Her iki versiyon için ayrı bir ses
track'i (`Audio` bileşeni, `src="audio/tr/scene-01.mp3"` gibi) sahnelerin
üzerine bindirilecek. Görsel (video) katmanı ikisinde de birebir aynı
kalıyor — sadece ses dosyaları değişiyor. Bu sayede tek kod tabanından iki
dil çıkışı alınabilir.

**Kapanış CTA görseli (Sahne 9 üzerine Remotion'da eklenecek metin):**
🇹🇷 "Hemen İndir — App Store · Web"
🇬🇧 "Download Now — App Store · Web"
(Gerçek link/URL netleşince buraya eklenecek.)

**Açılış metni güçlendirmesi (Gemini'nin önerisi):** Sahne 1'in üzerindeki
"Yapay zekayı ustaca kullan." yazısı hem daha kalın/kontrastlı hale
getirilecek hem de artık aynı mesaj Sahne 2'nin voiceover'ında sesli olarak
da tekrarlanıyor — metne bağımlılık azaldı.
