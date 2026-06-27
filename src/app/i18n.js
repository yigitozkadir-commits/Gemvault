import { bus } from './bus.js';

export let locale = 'tr';
const cache = {};

export async function loadLocale(code) {
  if (cache[code]) return cache[code];
  try {
    const mod = await import(`../locales/${code}.js`);
    cache[code] = mod.default || mod;
  } catch {
    cache[code] = {};
  }
  return cache[code];
}

export function t(key, params = {}) {
  const msg = cache[locale]?.[key] ?? cache['tr']?.[key] ?? key;
  return msg.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

export async function setLocale(code) {
  await loadLocale(code);
  locale = code;
  document.documentElement.lang = code;
  bus.emit('locale:change', code);
}

export async function initI18n() {
  const saved = localStorage.getItem('gv:settings.locale') || 'tr';
  await loadLocale('tr');
  if (saved !== 'tr') await loadLocale(saved);
  locale = saved;
  document.documentElement.lang = locale;
}
