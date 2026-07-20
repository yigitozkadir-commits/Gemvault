#!/usr/bin/env python3
"""PiAPI ile toplu watermark temizleme.

Kullanim:
    export PIAPI_API_KEY="..."
    python3 scripts/remove_watermark_piapi.py public/clips/ad4-scene-01.mp4 [digerleri...]

Her dosya icin:
    1. Videoyu gecici bir genel URL'e yukler (0x0.st) -- PiAPI dosya degil,
       URL istiyor.
    2. PiAPI'de bir "remove-watermark" task'i baslatir.
    3. Task tamamlanana kadar bekler (polling).
    4. Sonucu indirip "<isim>.clean.mp4" olarak kaydeder.

ONEMLI -- TEST EDILEMEDI: Bu ortamdan (Claude Code sandbox) api.piapi.ai'ye
erisim ag politikasi tarafindan engelleniyor, bu yuzden bu script burada
calistirilip dogrulanamadi. Istek/yanit alanlari PiAPI'nin genel
dokumantasyon ozetine (model="seedance", task_type="remove-watermark",
"x-api-key" header) dayaniyor -- gercek calistirmada kucuk farklar
cikabilir (ozellikle auth header adi ve response alan isimleri). Ilk
calistirmada hata alirsan PiAPI'nin kendi "Quick Start" sayfasindaki
ornek curl isteğiyle karsilastir.

GIZLILIK NOTU: upload_temp() klibi gecici olarak herkese acik, anonim bir
dosya barindirma servisine (0x0.st) yukluyor ki PiAPI oradan cekebilsin.
Dosya birkac saat sonra kendiliginden siliniyor ama bu sure icinde linki
bilen herkes erisebilir. Kendi S3/GCS gibi bir depolama alanin varsa
upload_temp() fonksiyonunu onunla degistirmen daha guvenli olur.
"""
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request

PIAPI_API_KEY = os.environ.get("PIAPI_API_KEY")
PIAPI_BASE = "https://api.piapi.ai/api/v1"
UPLOAD_HOST = "https://0x0.st"


def upload_temp(path: str) -> str:
    """Dosyayi gecici olarak barindirip herkese acik URL doner."""
    boundary = "----piapiUploadBoundary"
    filename = os.path.basename(path)
    content_type = mimetypes.guess_type(filename)[0] or "video/mp4"
    with open(path, "rb") as f:
        data = f.read()
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        UPLOAD_HOST,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "gemvault-watermark-cleaner/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        return resp.read().decode().strip()


def create_task(video_url: str) -> str:
    payload = {
        "model": "seedance",
        "task_type": "remove-watermark",
        "input": {"video_url": video_url},
    }
    req = urllib.request.Request(
        f"{PIAPI_BASE}/task",
        data=json.dumps(payload).encode(),
        headers={"x-api-key": PIAPI_API_KEY, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    return data["data"]["task_id"]


def poll_task(task_id: str, timeout: int = 300, interval: int = 5) -> str:
    req_url = f"{PIAPI_BASE}/task/{task_id}"
    waited = 0
    while waited < timeout:
        req = urllib.request.Request(req_url, headers={"x-api-key": PIAPI_API_KEY})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        status = data["data"]["status"]
        if status == "completed":
            return data["data"]["output"]["video_url"]
        if status == "failed":
            raise RuntimeError(f"Task basarisiz: {data}")
        time.sleep(interval)
        waited += interval
    raise TimeoutError(f"Task {task_id} zaman asimina ugradi")


def download(url: str, out_path: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "gemvault-watermark-cleaner/1.0"})
    with urllib.request.urlopen(req, timeout=180) as resp, open(out_path, "wb") as f:
        f.write(resp.read())


def clean_video(path: str) -> None:
    print(f"[{path}] gecici URL'e yukleniyor...")
    video_url = upload_temp(path)
    print(f"[{path}] yuklendi: {video_url}")

    task_id = create_task(video_url)
    print(f"[{path}] task basladi: {task_id}, bekleniyor...")

    result_url = poll_task(task_id)
    out_path = path.rsplit(".", 1)[0] + ".clean.mp4"
    download(result_url, out_path)
    print(f"[{path}] tamamlandi -> {out_path}")


def main() -> None:
    if not PIAPI_API_KEY:
        print("HATA: PIAPI_API_KEY ortam degiskeni tanimli degil.", file=sys.stderr)
        sys.exit(1)
    if len(sys.argv) < 2:
        print("Kullanim: python3 remove_watermark_piapi.py <video1.mp4> [video2.mp4 ...]")
        sys.exit(1)

    failures = []
    for path in sys.argv[1:]:
        try:
            clean_video(path)
        except (urllib.error.HTTPError, urllib.error.URLError, RuntimeError, TimeoutError) as e:
            print(f"[{path}] HATA: {e}", file=sys.stderr)
            failures.append(path)

    if failures:
        print(f"\n{len(failures)} dosya basarisiz oldu: {failures}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
