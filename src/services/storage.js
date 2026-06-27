const SCHEMA_VERSION = 2;
const SCHEMA_KEY = 'gv:schema';

const OLD_KEYS = {
  apiKey: ['gv_gemini_k', 'gemvault_api_key'],
  favorites: ['gv_favorites'],
  collections: ['gv_collections'],
  radarHistory: ['radarHistory'],
  pwaDismissed: ['pwa_dismissed'],
};

const KEYS = {
  apiKey: 'gv:apiKey',
  favorites: 'gv:favorites',
  collections: 'gv:collections',
  radarHistory: 'gv:radar:history',
  radarLastScan: 'gv:radar:lastScan',
  radarCache: 'gv:radar:cache',
  pwaDismissed: 'gv:pwa:dismissed',
  settings: 'gv:settings',
};

function migrateOnce() {
  const ver = parseInt(localStorage.getItem(SCHEMA_KEY) || '1');
  if (ver >= SCHEMA_VERSION) return;

  // Migrate API key — prefer gv_gemini_k over gemvault_api_key
  for (const old of OLD_KEYS.apiKey) {
    const v = localStorage.getItem(old);
    if (v && !localStorage.getItem(KEYS.apiKey)) {
      localStorage.setItem(KEYS.apiKey, v);
    }
    localStorage.removeItem(old);
  }

  // Migrate favorites
  const favOld = localStorage.getItem('gv_favorites');
  if (favOld && !localStorage.getItem(KEYS.favorites)) {
    localStorage.setItem(KEYS.favorites, favOld);
    localStorage.removeItem('gv_favorites');
  }

  // Migrate collections
  const colOld = localStorage.getItem('gv_collections');
  if (colOld && !localStorage.getItem(KEYS.collections)) {
    localStorage.setItem(KEYS.collections, colOld);
    localStorage.removeItem('gv_collections');
  }

  // Migrate radar history
  const rhOld = localStorage.getItem('radarHistory');
  if (rhOld && !localStorage.getItem(KEYS.radarHistory)) {
    localStorage.setItem(KEYS.radarHistory, rhOld);
    localStorage.removeItem('radarHistory');
  }

  // Migrate pwa dismissed
  const pwOld = localStorage.getItem('pwa_dismissed');
  if (pwOld && !localStorage.getItem(KEYS.pwaDismissed)) {
    localStorage.setItem(KEYS.pwaDismissed, pwOld);
    localStorage.removeItem('pwa_dismissed');
  }

  localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
}

function jsonGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

function jsonSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Lazy-import secure-key to avoid circular dependencies
let secureKey = null;

async function getSecureKey() {
  if (!secureKey) {
    try {
      secureKey = await import('./secure-key.js');
    } catch {
      return null;
    }
  }
  return secureKey;
}

export const storage = {
  init() { migrateOnce(); },

  async getApiKey() {
    const sk = await getSecureKey();
    if (sk) return await sk.decryptApiKey();
    return localStorage.getItem(KEYS.apiKey) || '';
  },

  async setApiKey(k) {
    const sk = await getSecureKey();
    if (sk) {
      await sk.encryptApiKey(k);
    } else {
      localStorage.setItem(KEYS.apiKey, k);
    }
  },

  async clearApiKey() {
    const sk = await getSecureKey();
    if (sk) await sk.clearEncryptedKey();
    localStorage.removeItem(KEYS.apiKey);
  },

  getFavorites() { return jsonGet(KEYS.favorites, []); },
  setFavorites(arr) { jsonSet(KEYS.favorites, arr); },

  getCollections() { return jsonGet(KEYS.collections, []); },
  setCollections(arr) { jsonSet(KEYS.collections, arr); },

  getRadarHistory() { return jsonGet(KEYS.radarHistory, []); },
  setRadarHistory(arr) { jsonSet(KEYS.radarHistory, arr); },

  getRadarLastScan() { return localStorage.getItem(KEYS.radarLastScan) || null; },
  setRadarLastScan(ts) { localStorage.setItem(KEYS.radarLastScan, ts); },

  getRadarCache() { return jsonGet(KEYS.radarCache, null); },
  setRadarCache(obj) { jsonSet(KEYS.radarCache, obj); },

  getPwaDismissed() { return !!localStorage.getItem(KEYS.pwaDismissed); },
  setPwaDismissed() { localStorage.setItem(KEYS.pwaDismissed, '1'); },

  getSettings() { return jsonGet(KEYS.settings, {}); },
  setSettings(obj) { jsonSet(KEYS.settings, obj); },
  patchSettings(patch) {
    const cur = this.getSettings();
    jsonSet(KEYS.settings, { ...cur, ...patch });
  },

  clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(SCHEMA_KEY);
  },
};
