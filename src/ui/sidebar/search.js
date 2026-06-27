import { bus } from '../../app/bus.js';
import { setState, state } from '../../app/state.js';
import { debounce } from '../../utils/debounce.js';
import { t } from '../../app/i18n.js';
import { isApiKeySet } from '../../services/gemini.js';
import { toast } from '../toast.js';

export function mountSearch(container) {
  container.innerHTML = `
    <div class="srch-wrap">
      <div class="srch-row">
        <div class="srch-inner">
          <span class="srch-icon">⌕</span>
          <input class="srch-input" id="searchInput" type="text" placeholder="${t('search.placeholder')}" autocomplete="off" spellcheck="false">
        </div>
        <button class="ai-btn" id="aiBtn" aria-pressed="false">${t('search.ai.btn')}</button>
      </div>
    </div>`;

  const input = container.querySelector('#searchInput');
  const aiBtn = container.querySelector('#aiBtn');

  aiBtn.addEventListener('click', () => {
    const newMode = !state.aiMode;
    setState({ aiMode: newMode });
    aiBtn.classList.toggle('active', newMode);
    aiBtn.setAttribute('aria-pressed', String(newMode));
    if (!newMode) {
      setState({ aiIds: null });
      clearAiBar();
      bus.emit('search:change', { term: state.searchTerm });
    } else if (state.searchTerm.length > 2) {
      doAiSearch(state.searchTerm);
    }
  });

  const onInput = debounce((term) => {
    setState({ searchTerm: term, activeCat: term ? state.activeCat : 'all', aiIds: null });
    clearAiBar();
    if (state.aiMode && term.length > 2) {
      doAiSearch(term);
      return;
    }
    bus.emit('search:change', { term });
  }, 300);

  input.addEventListener('input', (e) => {
    onInput(e.target.value.trim());
  });

  bus.on('search:clear', () => {
    input.value = '';
    setState({ searchTerm: '', aiIds: null });
    clearAiBar();
  });
}

function clearAiBar() {
  const bar = document.getElementById('aiBar');
  if (bar) bar.innerHTML = '';
}

async function doAiSearch(q) {
  if (!isApiKeySet()) {
    toast.warn(t('search.ai.need_key'));
    return;
  }
  const bar = document.getElementById('aiBar');
  if (bar) bar.innerHTML = `<div class="ai-badge-bar"><span style="color:var(--gold)">✦</span> ${t('search.ai.searching').replace('{q}', q)}</div>`;

  const { GEMS } = await import('../../data/gems.js');
  const { callGemini } = await import('../../services/gemini.js');
  const names = GEMS.map((g) => g.id + ':' + g.name + ' — ' + g.desc).join('\n');

  try {
    const raw = await callGemini(
      'Semantik arama motorusun. Gem listesinden sorguya en alakalı 15 ID\'yi JSON array olarak döndür. Sadece array, örnek: [1,5,12]',
      `Sorgu: "${q}"\n\nGemler:\n${names}`
    );
    const m = raw.match(/\[\d[\d,\s]*\]/);
    if (m) {
      const aiIds = JSON.parse(m[0]);
      setState({ aiIds });
      if (bar) bar.innerHTML = `<div class="ai-badge-bar">✦ ${t('search.ai.results').replace('{n}', aiIds.length).replace('{q}', q)}</div>`;
    } else {
      setState({ aiIds: null });
      if (bar) bar.innerHTML = `<div class="ai-badge-bar">${t('search.ai.none')}</div>`;
    }
    bus.emit('search:change', { term: q });
  } catch (e) {
    if (bar) bar.innerHTML = `<div class="ai-badge-bar" style="color:var(--text3)">Hata: ${e.message}</div>`;
  }
}
