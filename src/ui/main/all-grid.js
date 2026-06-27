import { GEMS } from '../../data/gems.js';
import { CATEGORIES } from '../../data/categories.js';
import { bus } from '../../app/bus.js';
import { escH } from '../../utils/escape.js';
import { t } from '../../app/i18n.js';

export function showAllGrid() {
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('gemDetail').style.display = 'none';
  document.getElementById('genPanel').style.display = 'none';
  document.getElementById('radarPanel').style.display = 'none';

  const grid = document.getElementById('allGrid');
  grid.style.display = 'grid';

  const grouped = {};
  CATEGORIES.forEach((c) => { grouped[c.id] = []; });
  GEMS.forEach((g) => { if (grouped[g.cat]) grouped[g.cat].push(g); });

  let html = `<div style="grid-column:1/-1;margin-bottom:6px"><div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text4);letter-spacing:.12em;text-transform:uppercase">${t('grid.title').replace('{n}', GEMS.length)}</div></div>`;

  CATEGORIES.forEach((cat) => {
    const gems = grouped[cat.id];
    if (!gems.length) return;
    html += `<div style="grid-column:1/-1;margin-top:18px;margin-bottom:3px"><div style="font-family:'DM Mono',monospace;font-size:9px;color:${cat.color};letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;gap:7px"><span style="width:15px;height:1px;background:${cat.color};display:inline-block;opacity:.5"></span>${escH(cat.emoji + ' ' + cat.label)} · ${gems.length}</div></div>`;
    gems.forEach((g) => {
      html += `<div class="all-card" data-id="${g.id}" style="--cc:${cat.color}"><div class="gno">${escH(g.no)}</div><h3>${escH(g.name)}</h3><p>${escH(g.desc)}</p></div>`;
    });
  });

  grid.innerHTML = html;
  grid.querySelectorAll('.all-card').forEach((el) => {
    el.addEventListener('click', () => bus.emit('gem:select', { id: parseInt(el.dataset.id) }));
  });
}

export function hideAllGrid() {
  const grid = document.getElementById('allGrid');
  if (grid) grid.style.display = 'none';
}
