# GemVault Pro — 735 Gemini Gem

> 18 kategoride 735 ileri seviye Gemini Gem talimatı. AI destekli arama, dinamik talimat üretimi, kişisel Gem Üretici.
>
> 735 advanced Gemini Gem instructions across 18 categories. AI-powered search, dynamic instruction generation, personal Gem Generator.

---

## Features / Özellikler

| Feature | TR | EN |
|---------|----|----|
| 735 Gem talimatı | ✅ Tüm kategoriler kapsanıyor | ✅ All categories covered |
| AI destekli arama | ✅ Gemini 2.0 Flash | ✅ Gemini 2.0 Flash |
| Dinamik talimat üretimi | ✅ Şablon + AI | ✅ Template + AI |
| Gem Üretici | ✅ Özel talimat | ✅ Custom instruction |
| AI Radar | ✅ Gerçek RSS + AI özet | ✅ Real RSS + AI summary |
| Molo AI Asistan | ✅ WebGL + TTS + STT | ✅ WebGL + TTS + STT |
| Favoriler & Koleksiyonlar | ✅ localStorage | ✅ localStorage |
| Toplu export | ✅ JSON / MD / TXT | ✅ JSON / MD / TXT |
| PWA | ✅ Offline desteği | ✅ Offline support |
| i18n TR / EN | ✅ Tam destek | ✅ Full support |
| Güvenli API key | ✅ AES-GCM + IndexedDB | ✅ AES-GCM + IndexedDB |
| A11y | ✅ WCAG AA | ✅ WCAG AA |

## Quick Start

```bash
# Prerequisites: Node 20+, pnpm 10+
git clone https://github.com/mk350174-cmd/Gemvault.git
cd Gemvault
pnpm install
pnpm dev
# Open http://localhost:5173
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server (localhost:5173) |
| `pnpm build` | Production build → dist/ |
| `pnpm preview` | Preview production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `node scripts/verify-data.mjs` | Verify all 735 gems have instructions |

## Architecture

```
src/
  app/         # bus, state, router, i18n
  data/        # gems, categories, instructions (8 chunks)
  features/    # favorites, collections, export, pte, similar, radar, molo
  locales/     # tr.js, en.js
  services/    # gemini, storage, secure-key, update-notifier
  styles/      # tokens, reset, main + component CSS
  ui/          # hero, sidebar, main, modals, toast, dialog
  utils/       # escape, debounce, dom, format, a11y
  main.js      # Boot sequence
  sw.js        # Service Worker (Workbox)
public/
  manifest.webmanifest
  icons/       # 13 icon sizes
android/
  twa-manifest.json
```

## Security

- API key encrypted with AES-GCM 256-bit (SubtleCrypto + PBKDF2, 100k iterations)
- CSP meta tag + HTTP headers (Netlify / Cloudflare)
- All innerHTML via `escH()` / `` html` `` tagged template
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`

## License

Apache-2.0 — see [LICENSE](LICENSE)
