import { GEMS } from '../../data/gems.js';
import { bus } from '../../app/bus.js';
import { state, setState } from '../../app/state.js';
import { escH } from '../../utils/escape.js';
import { getCatColor } from '../../utils/format.js';
import { t } from '../../app/i18n.js';

export function mountGemsList(container) {
  container.innerHTML = `<div class="gems-list" id="gemsList"></div>`;

  renderList();

  bus.on('search:change', () => renderList());
  bus.on('cat:select', () => renderList());
  bus.on('state:change', ({ activeGem: gem }) => {
    if (gem !== undefined) {
      container.querySelectorAll('.gem-item').forEach((el) => {
        el.classList.toggle('active', parseInt(el.dataset.id) === gem?.id);
      });
    }
  });
}

function renderList() {
  const list = document.getElementById('gemsList');
  if (!list) return;

  let fl = GEMS;

  if (state.aiMode && state.aiIds) {
    fl = state.aiIds.map((id) => GEMS.find((g) => g.id === id)).filter(Boolean);
  } else {
    const s = state.searchTerm.toLowerCase();
    fl = GEMS.filter((g) => {
      const catOk = state.activeCat === 'all' || g.cat === state.activeCat;
      const termOk = !s || g.name.toLowerCase().includes(s) || g.desc.toLowerCase().includes(s) || g.no.toLowerCase().includes(s);
      return catOk && termOk;
    });
  }

  if (!fl.length) {
    list.innerHTML = `<div style="padding:18px;text-align:center;font-family:'DM Mono',monospace;font-size:11px;color:var(--text4)">${t('search.no_results')}</div>`;
    return;
  }

  const s = state.searchTerm;
  const re = s && !state.aiMode ? new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi') : null;

  const highlight = (str) => (re ? str.replace(re, '<mark>$1</mark>') : escH(str));

  list.innerHTML = fl.map((g) => {
    const cc = getCatColor(g.cat);
    const nm = highlight(g.name);
    const dc = highlight(g.desc);
    const active = state.activeGem?.id === g.id ? ' active' : '';
    return `<div class="gem-item${active}" data-id="${g.id}" style="--cc:${cc}"><span class="gem-no">${escH(g.no)}</span><div class="gem-info"><div class="gem-name">${nm}</div><div class="gem-desc-s">${dc}</div></div></div>`;
  }).join('');

  list.querySelectorAll('.gem-item').forEach((el) => {
    el.addEventListener('click', () => {
      const gem = GEMS.find((g) => g.id === parseInt(el.dataset.id));
      if (gem) bus.emit('gem:select', { id: gem.id });
    });
  });
}
