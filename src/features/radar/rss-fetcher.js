import { storage } from '../../services/storage.js';

const PROXY_CHAIN = [
  (url) => `https://r.jina.ai/${url}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

const CACHE_KEY = 'gv:radar:lastScan';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchRSS(feedUrl) {
  const cached = storage.getRadarCache();
  if (cached?.url === feedUrl && Date.now() - cached.time < CACHE_TTL) {
    return cached.items;
  }

  for (const proxyFactory of PROXY_CHAIN) {
    try {
      const proxyUrl = proxyFactory(feedUrl);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const text = await res.text();
      const items = parseRSS(text);
      if (items.length > 0) {
        storage.setRadarCache({ url: feedUrl, items, time: Date.now() });
        return items;
      }
    } catch (e) {
      // Try next proxy
      continue;
    }
  }

  // Return last cached or empty
  const fallback = storage.getRadarCache();
  return fallback?.items || [];
}

function parseRSS(xml) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      return [];
    }

    const items = [];
    const entries = doc.querySelectorAll('item, entry');
    entries.forEach((entry) => {
      const title = entry.querySelector('title')?.textContent || '';
      const link = entry.querySelector('link')?.textContent || entry.querySelector('link')?.getAttribute('href') || '';
      const pubDate = entry.querySelector('pubDate, published')?.textContent || '';
      const description = entry.querySelector('description, summary')?.textContent || '';

      if (title && link) {
        items.push({
          title: title.trim(),
          link: link.trim(),
          pubDate: pubDate.trim(),
          description: description.trim().substring(0, 200),
        });
      }
    });

    return items.slice(0, 5); // Return top 5
  } catch (e) {
    return [];
  }
}

export async function fetchAllSources(sources) {
  const results = [];
  for (const source of sources) {
    try {
      const items = await fetchRSS(source.feed);
      results.push({ source, items });
    } catch (e) {
      results.push({ source, items: [] });
    }
  }
  return results;
}
