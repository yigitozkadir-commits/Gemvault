import { CATEGORIES } from '../../data/categories.js';
import { GEMS } from '../../data/gems.js';
import { bus } from '../../app/bus.js';
import { setState, state } from '../../app/state.js';
import { t } from '../../app/i18n.js';

export function mountCategoryList(container) {
  const allCount = GEMS.length;

  const catHtml = CATEGORIES.map((c) => {
    const n = GEMS.filter((g) => g.cat === c.id).length;
    return `<div class="cat-sec"><button class="cat-btn" data-cat="${c.id}" style="--cc:${c.color}"><span class="cdot"></span><span class="cname">${c.emoji} ${c.label}</span><span class="ccount">${n}</span></button></div>`;
  }).join('');

  container.innerHTML = `
    <div class="cat-sec">
      <div class="cat-hdr">${t('cat.header')}</div>
      <button class="cat-btn active" data-cat="all" style="--cc:#c9a84c">
        <span class="cdot"></span><span class="cname">${t('cat.all')}</span><span class="ccount">${allCount}</span>
      </button>
    </div>
    <div id="catBtns">${catHtml}</div>
    <div id="aiBar"></div>`;

  container.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCat(btn.dataset.cat);
    });
  });

  bus.on('state:change', ({ activeCat: cat }) => {
    if (cat !== undefined) {
      container.querySelectorAll('.cat-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.cat === cat);
      });
    }
  });
}

function setActiveCat(cat) {
  setState({ activeCat: cat, searchTerm: '', aiIds: null });
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const aiBar = document.getElementById('aiBar');
  if (aiBar) aiBar.innerHTML = '';
  bus.emit('cat:select', { id: cat });
}
