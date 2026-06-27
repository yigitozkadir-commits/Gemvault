import { storage } from './storage.js';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function callGemini(sys, msg, opts = {}) {
  const key = storage.getApiKey();
  if (!key) throw new Error('API key yok. Lütfen Gemini API anahtarınızı girin.');

  const model = opts.model || DEFAULT_MODEL;
  const url = `${BASE_URL}/${model}:generateContent?key=${key}`;
  const body = {
    systemInstruction: { parts: [{ text: sys }] },
    contents: [{ role: 'user', parts: [{ text: msg }] }],
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens || 1200,
      temperature: opts.temperature ?? 0.7,
    },
  };

  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(Math.pow(2, attempt) * 1000);
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error?.message || `API ${r.status}`);
      }
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      lastErr = e;
      if (e.name === 'AbortError') throw e;
      if (e.message?.includes('API key') || e.message?.includes('401')) throw e;
    }
  }
  throw lastErr;
}

export function isApiKeySet() {
  return !!storage.getApiKey();
}
