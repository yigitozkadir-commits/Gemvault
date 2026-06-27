import { GEMS } from '../data/gems.js';
import { bus } from '../app/bus.js';
import { state } from '../app/state.js';
import { getCatColor } from '../utils/format.js';
import { callGemini, isApiKeySet } from '../services/gemini.js';
import { storage } from '../services/storage.js';
import { escH } from '../utils/escape.js';
import { toast } from '../ui/toast.js';

export function fallback(gem) {
  const sameCat = GEMS.filter(g => g.cat === gem.cat && g.id !== gem.id);
  const scored = sameCat.map(g => {
    const srcTokens = new Set([...gem.name.toLowerCase().split(/\s+/),
                               ...gem.desc.toLowerCase().split(/\s+/)]);
    const tgtTokens = [...g.name.toLowerCase().split(/\s+/),
                       ...g.desc.toLowerCase().split(/\s+/)];
    const overlap = tgtTokens.filter(t => srcTokens.has(t) && t.length > 2).length;
    return { gem: g, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(s => ({ ...s.gem, _reason: 'Aynı kategori' }));
}

export async function fetchAI(gem) {
  const catalog = GEMS
    .filter(g => g.id !== gem.id)
    .map(g => `${g.id}:${g.name} — ${g.desc} [${g.cat}]`)
    .join('\n');

  const sys = `Sen bir semantik benzerlik motorusun. Kullanıcının verdiği gem ile en çok benzeşen 5 gem ID'sini JSON formatında döndür.
Format: [{"id":N,"reason":"kısa Türkçe gerekçe (max 6 kelime)"}]
Sadece bu JSON'ı yaz, başka hiçbir şey yazma.`;

  const msg = `Referans Gem:
Ad: ${gem.name}
Açıklama: ${gem.desc}
Kategori: ${gem.cat}
Kullanım: ${gem.useCase}

Katalog (id:ad — açıklama [kategori]):
${catalog}`;

  const raw = await callGemini(sys, msg);
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('JSON parse failed');
  const parsed = JSON.parse(jsonMatch[0]);

  return parsed
    .map(item => {
      const g = GEMS.find(x => x.id === item.id);
      return g ? { ...g, _reason: item.reason || 'Semantik benzerlik' } : null;
    })
    .filter(Boolean)
    .slice(0, 5);
}

function renderLoading(container) {
  const skeletons = Array(5).fill(0).map(() => `
    <div class="sim-skeleton">
      <div class="sim-shimmer" style="width:40%;height:10px"></div>
      <div class="sim-shimmer" style="width:80%;height:12px"></div>
      <div class="sim-shimmer" style="width:65%;height:10px"></div>
    </div>`).join('');
  container.innerHTML = `
    <div class="sim-hdr">
      <span class="sim-title">Benzer Gemler <span class="sim-title-badge">✦ AI</span></span>
    </div>
    <div class="sim-grid">${skeletons}</div>`;
}

export function renderCards(container, gems, isAI, gem) {
  const cc = getCatColor(gem.cat);
  const cards = gems.map(g => {
    const gc = getCatColor(g.cat);
    return `<div class="sim-card" data-id="${g.id}" style="--cc:${gc}">
      <div class="sim-card-no">${g.no}</div>
      <div class="sim-card-name">${escH(g.name)}</div>
      <div class="sim-card-desc">${escH(g.desc)}</div>
      ${g._reason ? `<div class="sim-card-reason">↳ ${escH(g._reason)}</div>` : ''}
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="sim-hdr" style="--cc:${cc}">
      <span class="sim-title">Benzer Gemler
        <span class="sim-title-badge">${isAI ? '✦ AI' : '· Kategori'}</span>
      </span>
      <button class="sim-refresh" id="simRefreshBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:9px;height:9px"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
        Yenile
      </button>
    </div>
    ${!isAI ? `<div class="sim-fallback-label">API key olmadan kategori bazlı gösteriliyor</div>` : ''}
    <div class="sim-grid">${cards}</div>`;

  container.querySelectorAll('.sim-card').forEach(el => {
    el.addEventListener('click', () => {
      const g = GEMS.find(x => x.id === parseInt(el.dataset.id));
      if (g) bus.emit('gem:select', { id: g.id });
    });
  });

  const refreshBtn = container.querySelector('#simRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refresh);
  }
}

export async function inject(gem) {
  if (!gem) return;

  const detail = document.getElementById('gemDetail');
  if (!detail) return;

  let sec = document.getElementById('simSection');
  if (!sec) {
    sec = document.createElement('div');
    sec.id = 'simSection';
    sec.className = 'sim-sec';
    detail.querySelector('.gem-detail')?.appendChild(sec);
  }

  renderLoading(sec);

  try {
    if (isApiKeySet()) {
      const suggestions = await fetchAI(gem);
      renderCards(sec, suggestions, true, gem);
    } else {
      const suggestions = fallback(gem);
      renderCards(sec, suggestions, false, gem);
    }
  } catch (e) {
    const suggestions = fallback(gem);
    renderCards(sec, suggestions, false, gem);
  }
}

export async function refresh() {
  const activeGem = state.activeGem;
  if (!activeGem) return;
  const btn = document.getElementById('simRefreshBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⟳ Yükleniyor...';
  }
  await inject(activeGem);
}

// Wire up to gem:select event
bus.on('gem:select', ({ id }) => {
  const gem = GEMS.find(g => g.id === id);
  if (gem) {
    setTimeout(() => inject(gem), 100);
  }
});
