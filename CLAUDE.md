# Gemvault — Üretim Rehberi (Remotion + ElevenLabs)

Bu dosya, "Bozkır Hatunları / Gök Umay" video serisini geliştirirken tekrar
tekrar karşılaşılan hatalardan ve kurulan tekniklerden derlenmiştir. Yeni bir
video hazırlarken önce burayı oku — aynı hataları tekrar bulmak yerine,
zaten çözülmüş sorunları bir kez daha çözme.

## 1. Proje yapısı

- Her seri filmi `src/scenes/*.tsx` altında tek dosya (kısa/orta format,
  9:16) ya da büyük projeler için kendi alt klasöründe (`src/taidula-epic/`,
  `src/bozkirin-uyanisi/` — segment/timeline verisi ayrı dosyada).
- Altyazı verisi her zaman `src/data/*Captions.ts` içinde, ElevenLabs
  "with-timestamps" hizalamasından türetilmiş gerçek kelime zamanlamasıyla
  (asla tahmini/senkronsuz altyazı kullanma).
- Kompozisyon boyut/süre sabitleri `src/theme.ts` içinde, her blok üstünde
  o projenin özetini anlatan bir yorum var — yeni proje eklerken aynı
  formatı koru (bağlam + ton + kaynak video/anlatım süresi notu).
- Yeni bir kompozisyon eklerken checklist: `theme.ts` (VIDEO_CONFIG +
  DURATION_FRAMES) → `src/data/*Captions.ts` → `src/scenes/*.tsx` (film
  component) → `src/Root.tsx` (import + `FilmWithOutro` sarmalayıcı +
  `<Composition>` girişi). Seri kapanış imzasını (GÖKUMAY amblemi,
  `FilmWithOutro`/`SeriesOutro`) atlamayı unutma — bir kere TaidulaEpic'te
  unutulmuştu, kullanıcı fark edip ekletti.

## 2. Kritik, bir kere yaşanmış ve tekrar YAŞANMAMASI gereken hatalar

### 2.1 Crossfade z-index, altyazıları görünmez yapabilir
Absolute-frame `<Sequence>` + manuel opacity crossfade tekniğinde (bkz. §3)
her segmente `zIndex` veriliyor (crossfade sırasını korumak için). CSS
kuralı: pozitif `zIndex`'i olan bir eleman, `zIndex` verilmemiş (auto)
kardeş elemanların HER ZAMAN üstünde boyanır — DOM sırası önemsiz.
**Sonuç:** `<AnimatedCaptions/>` veya cutaway/dipnot katmanlarına sabit,
yüksek bir `zIndex` (örn. 9999) verilmezse, segment katmanının arkasında
kalıp render'da HİÇ görünmezler — veri doğru olsa bile. Bu, Bozkırın
Uyanışı v2'de tüm video boyunca altyazıların hiç görünmemesine yol açtı ve
gerçek render'dan kare çekip incelenene kadar fark edilmedi. **Bu tekniği
her kullandığında altyazı/dipnot katmanına baştan yüksek zIndex ver.**

### 2.2 Anlatım Audio'sunun Sequence offset'i unutulursa
Anlatım dosyası, sayfalar arası sessizlik/ara sahne boşlukları için splice
edildiyse ve dosyanın kendisi t=0'da doğrudan gerçek içerikle başlıyorsa
(örn. sayfa 2 metni), `<Audio>` elemanı mutlaka `<Sequence
from={GLOBAL_INTRO_OFFSET}>` içine alınmalı. Unutulursa anlatım videonun en
başından (kapak/giriş sahnesinden) çalmaya başlar — hem yanlış görselin
üstünde konuşma duyulur hem de yeni eklenen herhangi bir açılış repliğiyle
üst üste biner ("2 ses karışmış" şikayeti buradan geldi). **Her yeni
splice edilmiş anlatım dosyasında, `<Audio>`'nun offset'ini dosyanın
GERÇEKTE nerede başladığıyla karşılaştır.**

### 2.3 "Benzeri görsel" eşleştirmesini yazılı prompt'a değil, mevcut dosyaya göre yap
Kullanıcı "bu sahneyi yeniden ürettim" diyip yeni bir görsel gönderdiğinde,
onu hangi slotun değiştireceğine yazılı prompt açıklamasına bakarak karar
verme — önce ilgili slotlardaki MEVCUT dosyaları aç ve kompozisyon olarak
hangisine en çok benzediğine bak. Bir kere, yazılı prompt benzerliğine
güvenilip yanlış slot değiştirildi; oysa doğru slotun mevcut görseli yeni
gönderilenle neredeyse birebir aynı kompozisyondaydı (aynı sahnenin başka
bir üretimi). **Kural: eşleştirmeden önce git history'den veya mevcut
dosyadan orijinali çıkarıp görsel olarak karşılaştır.**

### 2.4 Bir şey "yanlış görünüyor" dendiğinde önce ölçerek doğrula
Kullanıcı "görsel yanlış" ya da "ses karışmış" dediğinde, ilk akla gelen
açıklamayı (örn. "görseli yanlış eşleştirmişim") hemen düzeltmeye girişme.
Gerçek render'dan o zaman damgasında kare çek / ffmpeg ile RMS-dB ölçümü
yap, gerçek kök nedeni doğrula. Bu oturumda birkaç kez "görsel yanlış"
şikayetinin gerçek nedeni aslında bambaşka bir katmandaki (ses senkronu)
bir hataydı — görsel baştan doğruydu.

## 3. Zaman çizelgesi / crossfade teknikleri

- **`@remotion/transitions`'ın `TransitionSeries`'i KULLANMA** eğer
  anlatım, önceden hesaplanmış gerçek kelime zamanlamasına (splice edilmiş
  bir dosyaya) bağlıysa — `TransitionSeries` komşu segmentleri crossfade
  kadar üst üste bindirip toplam süreyi kısaltır, bu da altyazı/anlatım
  senkronunu bozar. Bunun yerine: her segment kendi MUTLAK (absolute) kare
  aralığında bağımsız bir `<Sequence>`; crossfade, sınırda opacity
  çakıştırmasıyla elde edilir (bkz. `BozkirinUyanisiFilmV2.tsx`,
  `BerelHatun.tsx`).
- **Doğru crossfade formülü** (siyah yanıp sönmeyi önler): her segment
  (sonuncu hariç) kendi mantıksal süresinin ÖTESİNE `CROSSFADE_FRAMES`
  kadar uzatılmış mount edilir, o uzatılmış kuyrukta 1'den 0'a soluyarak
  altındaki (hep opacity 1, hiç solmayan) bir sonraki segmenti ortaya
  çıkarır. `zIndex: segments.length - index` önceki segmentin üstte
  kalmasını sağlar. **Yanlış olan** (ve 1 karelik siyah yanıp sönmeye yol
  açan) yöntem: her iki segmentin de sınırda bağımsız olarak 0 opacity'ye
  inmesi — `<Sequence>` `[from, from+duration)` yarı-açık olduğu için o
  anda hiçbir segment tam opak değildir.
- **`TransitionSeries` ne zaman güvenli:** anlatım TEK parça, kesintisiz
  bir dosyaysa (splice/sessizlik-ekleme yoksa) — o zaman segment
  sınırlarının birkaç kare kayması pratikte önemsizdir (bkz. `TaidulaEpic`,
  `Timeline.tsx`).
- **Anlatım videodan kısa/uzun kaldığında:** narration video süresini
  aşıyorsa son sahne kendi son karesinde `<Freeze>` ile donar, anlatım
  bitene kadar ekranda kalır (bkz. Ukok Prensesi, Loulan Güzeli, Berel
  Hatun). Video anlatımdan uzunsa (görsel süre anlatımı aşıyorsa) ve fark
  büyükse (örn. 78sn), bu neredeyse kesin bir tasarım hatasıdır — ya
  anlatımı uzat (yeni bir epilog/pasaj ekle) ya da görsel süreyi kısalt.

## 4. Ses / ElevenLabs

- **Aynı proje/seri için mutlaka aynı sesi kullan.** Hangi `voice_id` ve
  `voice_settings`'in kullanıldığını bulmak için ElevenLabs History API'yi
  (`GET /v1/history`, metin parçasıyla arama) sorgula — asla tahmin etme.
  Bu depoda anlatıcı sesi sabit: `3BJTXArCvMUh3FJduxup` ("Deniz - Cing
  Hatun Narrator").
- Tonlar projeye göre kasıtlı olarak farklılaştırılmış:
  hükümdar/güç anlatıları (Taidula, Çing Hatun vb.) daha net/otoriter
  (stability ~0.5, style ~0.17); "gizem ailesi" (Subeşi, Loulan, Ukok,
  Berel Hatun — kimliği bilinmeyen/az bilinen figürler) daha yavaş, daha
  alçak, fısıltıya yakın (stability ~0.52-0.58, style ~0.15-0.20). Yeni bir
  video eklerken hangi aileye ait olduğuna göre bu aralığı kullan.
- **SSML `<break>` etiketleri hizalama karakterlerine karışır** — kelime
  segmentasyonu yaparken `<...>` etiket aralıklarını karakter dizisinden
  filtrelemeden (in_tag takibiyle) kelime ayırmaya çalışma, sahte
  "kelimeler" (`<break`, `time="300ms"/>` gibi) üretirsin.
- **Cümle eşleştirme:** alt metni ElevenLabs hizalamasından cümlelere
  bölerken substring arama yerine, orijinal cümle listesinin token'larını
  SIRAYLA tüketerek eşleştir (tekrarlayan kelimeler olduğunda substring
  arama yanlış yere denk gelebilir).
- **Mevcut bir cümleyi düzeltme / yeni pasaj ekleme:** tek cümleyi
  değiştirmek için sadece o cümleyi yeniden seslendirip mevcut dosyanın
  duraklama noktalarına splice et, SONRAKİ tüm cue'ları kayma farkı kadar
  kaydır (`shift_delta`). Sona ekleme (epilog) ise basit concat yeterli,
  kaydırma gerekmez. Her iki durumda da Python scriptiyle hesapla — 50+
  cue'yu elle kaydırmaya çalışma.
- Müzik/ambiyans varsa anlatım sırasında kısılmalı (`ducking`), ara
  sahnelerde/videolarda belirgin olmalı. Video klipler kendi gömülü sesiyle
  geliyorsa (Google Flow üretimi) **`volume={0}` vermeyi unutma** — aksi
  halde kontrolsüz, dengelenmemiş bir ses katmanı anlatımın üstüne biner
  (TaidulaEpic'te bu unutulmuş, henüz düzeltilmedi — bkz. §6 açık işler).

## 5. Bilimsel dürüstlük / içerik disiplini

- "Gizem ailesi" videolarında yüz/kafatası rekonstrüksiyon verisi yoksa
  kapanışta küçük, soluk bir dipnot olmalı (`FootnoteCaption` —
  `AnimatedCaptions`'tan bilinçli olarak ayrı, ekranın ÜSTÜNDE durur,
  ana altyazıyla çakışmaz).
- Kullanıcı A/B/C/D güvenilirlik katmanlı bir araştırma raporu
  gönderdiğinde: rapordaki bulguları sadece o an üzerinde çalışılan videoya
  değil, mümkünse SERİDEKİ DİĞER videolara karşı da kontrol et — aynı
  anakronizm/hata başka bir filmde de geçiyor olabilir (bu oturumda sadece
  Taidula kontrol edildi, "Altın Orda" adı diğer Bozkır Hatunları
  filmlerinde de geçiyor olabilir — kontrol edilmedi, açık iş).
- Yeni araştırma metni/taslağı geldiğinde tamamını olduğu gibi yapıştırmak
  yerine, projeyle ÇAKIŞAN kısımları ele (zaten anlatılmış bir şeyi tekrar
  etme) ve doğrulanabilir [A]/[B] katmanlı kısımları önceliklendir.

## 6. Render / teslimat / hosting

- Tam kaliteli render (8+ dk video) 700MB–1.1GB civarında oluyor.
  `SendUserFile` sohbet üzerinden **30MB sert sınırı** var — bu yüzden her
  zaman iki teslimat var: (1) sıkıştırılmış önizleme (960x540 ya da dikey
  540x960, `crf 26-30`, `preset veryfast`) sohbete direkt gönderilir, (2)
  gerçek/tam kalite dosya için harici hosting gerekir.
- **Kaggle Datasets, tam kalite dosya transferi için çalışan tek yol.**
  `~/.kaggle/access_token` dosyasına bearer token yazıp `kagglehub`
  (`pip install kagglehub`) ile `kagglehub.dataset_upload(handle,
  local_dir, version_notes=...)` çağır — curl/requests ile normal HTTP
  streaming upload yapıyor, dosya boyutu sorunu yok (1.1GB'lık dosya
  ~15 saniyede yüklendi). Google Drive MCP aracı (`create_file`) BUNUN
  YERİNE GEÇMEZ — o, dosyanın tamamını tek bir tool-call parametresine
  base64 olarak gömmeyi istiyor, birkaç yüz MB'ta bile pratik değil.
- **Kaggle GPU render için işe yaramaz** — Remotion'ın darboğazı CPU
  (headless Chromium kare yakalama + libx264 yazılım kodlama), GPU compute
  değil. Kaggle CPU-paralel notebook'lar (`--frames=X-Y` ile bölüp 5
  kernel'de paralel render) TEKNİK olarak mümkün ama kurulum/orkestrasyon
  maliyeti (her kernel'e Node+Chromium+asset senkronu, polling, birleştirme)
  bu ortamın kendi 4 çekirdeğine göre kazandırdığından daha pahalı — sadece
  render süreleri gerçekten saatler mertebesine çıkarsa ciddiye alınmalı.
- **Arka planda render çalışırken kaynak dosyaları DEĞİŞTİRME.** Render
  dosyaları o an okuduğu noktada bulduğu haliyle kullanır; yarıda dosya
  değiştirirsen render'ın bir kısmı eski, bir kısmı yeni içerik karışımı
  olur. Bir değişiklik yapman gerekiyorsa önce çalışan render'ı
  (`pkill -f "remotion render"`) durdur, sonra değişikliği yap, sonra
  yeniden başlat.
- İki render'ı aynı anda arka planda çalıştırmak teknik olarak mümkün ama
  ikisi de bu ortamın 4 çekirdeğini paylaştığı için ikisini de yavaşlatır —
  mümkünse sıraya koy.

## 7. Token / görsel inceleme ekonomisi

Kullanıcı birden fazla referans görsel/dosya attığında her birini
`Read`/vision ile tek tek incelemek pahalı. Önce programatik kontrol
(PIL ile boyut/format, dosya adı eşleştirme) yap; görsel olarak
karşılaştırma sadece gerçekten bir yerleşim kararı vermen gerektiğinde ve
mümkünse tek bir temsilci karşılaştırmayla yap (bkz. §2.3 — o zaman bile
MEVCUT dosyaya karşı karşılaştır, yazılı açıklamaya değil).

## 8. Açık işler / bilinen eksikler (bu dosya yazıldığı an itibarıyla)

- `TaidulaEpic`'teki video klipleri (`VideoSegment.tsx`) hâlâ
  `volume={0}` almıyor — 8 klibin kendi sesi anlatımın üstünde kontrolsüz
  çalıyor (bkz. §4 son madde). Kullanıcı bunu bilerek "78 saniyelik
  sessizlik" sorunundan sonraki adım olarak işaretledi, henüz
  düzeltilmedi.
- "Altın Orda" adlandırma düzeltmesi sadece `TaidulaEpic`'te yapıldı;
  serideki diğer filmlerde aynı ifade geçip geçmediği kontrol edilmedi.
