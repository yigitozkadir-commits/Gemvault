import { RADAR_SOURCES } from '../../data/radar-sources.js';
import { escH } from '../../utils/escape.js';
import { t } from '../../app/i18n.js';
import { isApiKeySet } from '../../services/gemini.js';
import { fetchAllSources } from './rss-fetcher.js';
import { summarizeHeadlines } from './radar-ai.js';
import { storage } from '../../services/storage.js';
import { toast } from '../../ui/toast.js';

let radarSelectedSources = new Set(RADAR_SOURCES.map((s) => s.id));

export function renderRadarPanel() {
  const panel = document.getElementById('radarPanel');
  if (!panel) return;
  panel.style.display = 'block';
  panel.innerHTML = `<div class="radar-panel">
    <div class="radar-hero">
      <div class="radar-eyebrow"><span class="radar-eyebrow-dot"></span>AI RADAR</div>
      <h2 class="radar-title">AI <em>Haberleri</em></h2>
      <p class="radar-sub">Yapay zeka dünyasındaki son gelişmeleri takip edin.</p>
    </div>
    <div class="radar-sources-grid" id="radarSourcesGrid">${RADAR_SOURCES.map((s) => `
      <div class="radar-source-card" data-id="${s.id}" style="--sc:${escH(s.color || '#c9a84c')}">
        <div class="radar-check">✓</div>
        <div class="radar-source-top">
          <span class="radar-source-icon">${s.emoji}</span>
          <span class="radar-source-name">${escH(s.name)}</span>
        </div>
        <div class="radar-source-desc">${escH(s.desc)}</div>
        <div class="radar-source-tag">${escH(s.tag)}</div>
      </div>`).join('')}
    </div>
    <div class="radar-action-row">
      <button class="radar-scan-btn" id="radarScanBtn">📡 Şimdi Tara</button>
      <span class="radar-sel-info"><span id="radarSelCount">${radarSelectedSources.size}</span> kaynak seçili</span>
    </div>
    <div id="radarResults" style="display:none"></div>
    <div id="radarEmpty" class="radar-empty">
      <div class="radar-empty-icon">📡</div>
      <div class="radar-empty-text">Taramak için yukarıdaki butona tıklayın</div>
    </div>
  </div>`;

  setupRadarListeners(panel);
}

function setupRadarListeners(panel) {
  const grid = panel.querySelector('#radarSourcesGrid');
  const scanBtn = panel.querySelector('#radarScanBtn');

  // Source selection
  grid.querySelectorAll('.radar-source-card').forEach((card) => {
    const id = card.dataset.id;
    if (radarSelectedSources.has(id)) card.classList.add('active');

    card.addEventListener('click', () => {
      if (radarSelectedSources.has(id)) {
        radarSelectedSources.delete(id);
        card.classList.remove('active');
      } else {
        radarSelectedSources.add(id);
        card.classList.add('active');
      }
      const count = panel.querySelector('#radarSelCount');
      if (count) count.textContent = radarSelectedSources.size;
    });
  });

  // Scan button
  scanBtn.addEventListener('click', () => scanRadar(panel));
}

async function scanRadar(panel) {
  if (radarSelectedSources.size === 0) {
    toast.warn('En az bir kaynak seçin');
    return;
  }

  const scanBtn = panel.querySelector('#radarScanBtn');
  const empty = panel.querySelector('#radarEmpty');
  const results = panel.querySelector('#radarResults');

  scanBtn.disabled = true;
  scanBtn.textContent = '⟳ Taranıyor...';
  results.style.display = 'none';
  empty.style.display = 'block';

  try {
    const selected = RADAR_SOURCES.filter((s) => radarSelectedSources.has(s.id));
    const fetched = await fetchAllSources(selected);
    const allItems = [];
    const sourceMap = new Map();

    fetched.forEach(({ source, items }) => {
      allItems.push(...items.map((i) => ({ ...i, sourceId: source.id })));
      sourceMap.set(source.id, source);
    });

    if (allItems.length === 0) {
      empty.innerHTML = `<div class="radar-empty-icon">📡</div><div class="radar-empty-text">Haberleri yüklenemedi. İnternet bağlantınızı kontrol edin.</div>`;
      empty.style.display = 'block';
      return;
    }

    // Show loading state
    empty.style.display = 'none';
    results.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text3)">⟳ AI haberleri analiz ediyor...</div>`;
    results.style.display = 'block';

    // Summarize with AI if available
    let analyzed = allItems;
    if (isApiKeySet()) {
      try {
        analyzed = await summarizeHeadlines(allItems);
      } catch (e) {
        // Fall back to unsummarized
      }
    }

    renderRadarResults(results, analyzed, sourceMap);
  } catch (e) {
    empty.innerHTML = `<div class="radar-empty-icon">⚠️</div><div class="radar-empty-text">Hata: ${escH(e.message)}</div>`;
    empty.style.display = 'block';
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '📡 Şimdi Tara';
  }
}

function renderRadarResults(container, items, sourceMap) {
  const html = `
    <div class="radar-results">
      <div class="radar-results-header">
        <div class="radar-results-title">📡 AI Haberleri</div>
        <div class="radar-results-count">${items.length} haber bulundu</div>
      </div>
      <div class="radar-items-list">
        ${items.map((item) => {
          const source = sourceMap.get(item.sourceId);
          const catColor = source?.color || '#c9a84c';
          return `
            <div class="radar-item">
              <div class="radar-item-source">
                <span class="radar-item-icon">${source?.emoji || '📰'}</span>
                <span class="radar-item-source-name">${escH(source?.name || 'Kaynak')}</span>
              </div>
              <div class="radar-item-content">
                <a href="${escH(item.link)}" target="_blank" rel="noopener noreferrer" class="radar-item-link">
                  <div class="radar-item-title">${escH(item.title)}</div>
                </a>
                ${item.summary ? `<div class="radar-item-summary">${escH(item.summary)}</div>` : ''}
                <div class="radar-item-meta">
                  ${item.pubDate ? `<span class="radar-item-date">${escH(item.pubDate.substring(0, 10))}</span>` : ''}
                  ${item.category ? `<span class="radar-item-category" style="--cc:${catColor}">${escH(item.category)}</span>` : ''}
                  ${item.trend ? `<span class="radar-item-trend">Trend: ${item.trend}/5</span>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>`;

  container.innerHTML = html;
  container.style.display = 'block';
}
