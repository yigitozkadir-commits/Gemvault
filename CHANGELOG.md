# Changelog

All notable changes to GemVault Pro are documented here.

## [6.0.0] — 2026-06-26

### Added
- Complete Vite+ESM modular architecture (replaces 15,275-line monolith)
- 735 Gem instructions (500 original + 235 generated for IDs 501-735)
- PWA: Service Worker, Web App Manifest, offline support, TWA config
- AES-GCM 256-bit API key encryption via SubtleCrypto + IndexedDB
- i18n: TR + EN with 156 locale keys, live language switcher
- Settings modal: language, API key management, data wipe, version
- Real RSS feed integration for AI Radar (r.jina.ai + allorigins proxy)
- Molo AI chatbot: WebGL glow, TTS, STT, Gemini conversation
- Bulk export: JSON / MD / TXT formats with source/format selection
- Favorites & Collections with localStorage persistence
- Prompt Template Editor with `[PLACEHOLDER]` auto-detection
- Similar gems (AI + category-based fallback)
- Custom Gem Generator
- A11y: focus trap, WCAG AA colors, keyboard shortcuts, aria-live
- CI: GitHub Actions (lint, typecheck, unit, e2e, Lighthouse, CodeQL)

### Changed
- All `alert()` / `confirm()` → toast + dialog components
- API key storage migrated from plain localStorage to AES-GCM encrypted
- Old localStorage keys (`gv_gemini_k`, `gv_favorites`, etc.) auto-migrated to `gv:*` namespace

### Security
- CSP meta tag + HTTP security headers (Netlify/Cloudflare)
- `eslint-plugin-no-unsanitized`: 0 violations
- All dynamic HTML via `escH()` XSS-safe escape function

### Fixed
- Monolith bug: undefined `filterList()` call in radar.js → `bus.emit('search:change')`
