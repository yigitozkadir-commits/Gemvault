import { GEMS } from '../data/gems.js';
import { CATEGORIES } from '../data/categories.js';
import { INSTRUCTIONS } from '../data/instructions/index.js';
import { state } from '../app/state.js';
import { storage } from '../services/storage.js';
import { getCatLabel } from '../utils/format.js';
import { toast } from '../ui/toast.js';
import { escH } from '../utils/escape.js';
import { bus } from '../app/bus.js';

let selectedIds = new Set();
let format = 'md';
let source = 'favorites';

function getInstr(gemId) {
  return INSTRUCTIONS[String(gemId)] || null;
}

function formatTXT(gems) {
  const lines = [];
  lines.push('GemVault Pro — Export');
  lines.push(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`);
  lines.push(`Toplam: ${gems.length} gem`);
  lines.push('═'.repeat(60));
  lines.push('');

  gems.forEach((g, i) => {
    lines.push(`${g.no} — ${g.name}`);
    lines.push(`Açıklama  : ${g.desc}`);
    lines.push(`Kategori  : ${getCatLabel(g.cat)}`);
    lines.push(`Kullanım  : ${g.useCase}`);
    lines.push(`Drive     : ${g.drive}`);
    const instr = getInstr(g.id);
    if (instr) {
      lines.push('');
      lines.push('── Talimat ──');
      lines.push(instr);
    }
    if (i < gems.length - 1) {
      lines.push('');
      lines.push('─'.repeat(60));
      lines.push('');
    }
  });

  return lines.join('\n');
}

function formatMD(gems) {
  const lines = [];
  lines.push('# GemVault Pro — Gem Export');
  lines.push('');
  lines.push(`> Tarih: ${new Date().toLocaleDateString('tr-TR')} · Toplam: ${gems.length} gem`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## İçindekiler');
  lines.push('');
  gems.forEach((g, i) => {
    const anchor = g.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-ğüşöçıİĞÜŞÖÇ]/g, '');
    lines.push(`${i + 1}. [${g.name}](#${anchor})`);
  });
  lines.push('');
  lines.push('---');
  lines.push('');

  gems.forEach(g => {
    lines.push(`## ${g.name}`);
    lines.push('');
    lines.push(`**No:** \`${g.no}\` | **Kategori:** ${getCatLabel(g.cat)}`);
    lines.push('');
    lines.push(`**Açıklama:** ${g.desc}`);
    lines.push('');
    lines.push(`**Kullanım Senaryosu:** ${g.useCase}`);
    lines.push('');
    lines.push(`**Önerilen Drive Dosyaları:** ${g.drive}`);
    const instr = getInstr(g.id);
    if (instr) {
      lines.push('');
      lines.push('### Gem Talimatı');
      lines.push('');
      lines.push('```');
      lines.push(instr);
      lines.push('```');
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

function formatJSON(gems) {
  const data = {
    source: 'GemVault Pro',
    exported: new Date().toISOString(),
    count: gems.length,
    gems: gems.map(g => ({
      id: g.id,
      no: g.no,
      name: g.name,
      description: g.desc,
      category: g.cat,
      categoryLabel: getCatLabel(g.cat),
      useCase: g.useCase,
      drive: g.drive,
      instruction: getInstr(g.id) || null
    }))
  };
  return JSON.stringify(data, null, 2);
}

function generate(gems) {
  switch (format) {
    case 'txt':  return { content: formatTXT(gems),  ext: 'txt',  mime: 'text/plain' };
    case 'json': return { content: formatJSON(gems), ext: 'json', mime: 'application/json' };
    default:     return { content: formatMD(gems),   ext: 'md',   mime: 'text/markdown' };
  }
}

function download(content, ext, mime) {
  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `gemvault-export-${Date.now()}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

function getSourceGems() {
  switch (source) {
    case 'favorites': {
      const favIds = storage.getFavorites();
      return favIds.map(id => GEMS.find(g => g.id === id)).filter(Boolean);
    }
    case 'category': {
      const activeGem = state.activeGem;
      return activeGem ? GEMS.filter(g => g.cat === activeGem.cat) : [];
    }
    case 'search': {
      const searchTerm = state.searchTerm;
      return GEMS.filter(g => {
        const s = searchTerm.toLowerCase();
        return s && (g.name.toLowerCase().includes(s) || g.desc.toLowerCase().includes(s));
      });
    }
    default:
      return [...GEMS];
  }
}

function renderModal() {
  document.getElementById('expModalOverlay')?.remove();

  const sourceGems = getSourceGems();
  const favCount = storage.getFavorites().length;
  const catCount = state.activeGem ? GEMS.filter(g => g.cat === state.activeGem.cat).length : 0;

  const sourceOptions = [
    { id: 'favorites', label: `♡ Favoriler (${favCount})` },
    { id: 'category',  label: `◆ Kategori (${catCount})` },
    { id: 'all',       label: `◈ Tümü (${GEMS.length})` },
  ];
  if (state.searchTerm) {
    const cnt = GEMS.filter(g => g.name.toLowerCase().includes(state.searchTerm.toLowerCase())).length;
    sourceOptions.push({ id: 'search', label: `⌕ Arama (${cnt})` });
  }

  const sourceBtns = sourceOptions.map(s =>
    `<button class="exp-source-btn${source === s.id ? ' active' : ''}" data-src="${s.id}">${s.label}</button>`
  ).join('');

  const rows = sourceGems.map(g => {
    const checked = selectedIds.has(g.id);
    return `<div class="exp-gem-row" data-gid="${g.id}">
      <div class="exp-checkbox${checked ? ' checked' : ''}" id="exp_cb_${g.id}"></div>
      <span class="exp-gem-no">${g.no}</span>
      <span class="exp-gem-name">${escH(g.name)}</span>
      <span class="exp-gem-cat">${escH(getCatLabel(g.cat))}</span>
    </div>`;
  }).join('');

  const fmtBtns = ['md','txt','json'].map(f =>
    `<button class="exp-fmt-btn${format === f ? ' active' : ''}" data-fmt="${f}">.${f.toUpperCase()}</button>`
  ).join('');

  const html = `<div id="expModalOverlay" class="exp-modal-overlay">
    <div class="exp-modal">
      <div class="exp-modal-head">
        <div class="exp-modal-title">Gem Export</div>
        <div class="exp-modal-sub">Kaynak seç → Gem'leri işaretle → Format belirle → İndir</div>
        <div style="margin-top:12px"><div class="exp-source-row">${sourceBtns}</div></div>
      </div>
      <div class="exp-gem-list">
        <div class="exp-selall-row">
          <span class="exp-selall-label">${sourceGems.length} gem listeleniyor</span>
          <button class="exp-selall-btn">Tümünü Seç / Kaldır</button>
        </div>
        ${rows || '<div style="padding:20px;font-family:\'DM Mono\',monospace;font-size:11px;color:var(--text4);text-align:center">Bu kaynakta gem yok</div>'}
      </div>
      <div class="exp-format-row">
        <span class="exp-format-label">Format:</span>
        ${fmtBtns}
      </div>
      <div class="exp-modal-foot">
        <span class="exp-sel-info" id="expSelInfo">${selectedIds.size} gem seçili</span>
        <div class="exp-foot-btns">
          <button class="exp-cancel-btn">İptal</button>
          <button class="exp-go-btn" id="expGoBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            İndir
          </button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  setupModalListeners(sourceGems);
  updateFooter();
}

function setupModalListeners(sourceGems) {
  const overlay = document.getElementById('expModalOverlay');

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay?.querySelectorAll('.exp-source-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setSource(e.target.dataset.src);
    });
  });

  overlay?.querySelectorAll('.exp-gem-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.classList.contains('exp-checkbox')) return;
      const gemId = parseInt(row.dataset.gid);
      toggleSel(gemId);
    });
  });

  overlay?.querySelectorAll('.exp-fmt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setFmt(e.target.dataset.fmt);
    });
  });

  overlay?.querySelector('.exp-selall-btn')?.addEventListener('click', toggleAll);
  overlay?.querySelector('.exp-cancel-btn')?.addEventListener('click', closeModal);
  overlay?.querySelector('#expGoBtn')?.addEventListener('click', execute);
}

function setSource(src) {
  source = src;
  const sourceGems = getSourceGems();
  selectedIds = new Set(sourceGems.map(g => g.id));
  renderModal();
}

function setFmt(fmt) {
  format = fmt;
  document.querySelectorAll('.exp-fmt-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.fmt === fmt);
  });
}

function toggleSel(gemId) {
  if (selectedIds.has(gemId)) selectedIds.delete(gemId);
  else selectedIds.add(gemId);

  const cb = document.getElementById(`exp_cb_${gemId}`);
  if (cb) cb.classList.toggle('checked', selectedIds.has(gemId));
  updateFooter();
}

function toggleAll() {
  const sourceGems = getSourceGems();
  const allSelected = sourceGems.every(g => selectedIds.has(g.id));
  if (allSelected) sourceGems.forEach(g => selectedIds.delete(g.id));
  else             sourceGems.forEach(g => selectedIds.add(g.id));

  sourceGems.forEach(g => {
    const cb = document.getElementById(`exp_cb_${g.id}`);
    if (cb) cb.classList.toggle('checked', selectedIds.has(g.id));
  });
  updateFooter();
}

function updateFooter() {
  const info = document.getElementById('expSelInfo');
  if (info) info.textContent = `${selectedIds.size} gem seçili`;
  const btn = document.getElementById('expGoBtn');
  if (btn) btn.disabled = selectedIds.size === 0;
}

function closeModal() {
  document.getElementById('expModalOverlay')?.remove();
}

function execute() {
  const gems = [...selectedIds]
    .map(id => GEMS.find(g => g.id === id))
    .filter(Boolean);

  if (!gems.length) return;

  const { content, ext, mime } = generate(gems);
  download(content, ext, mime);

  const btn = document.getElementById('expGoBtn');
  if (btn) {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><polyline points="20,6 9,17 4,12"/></svg> İndiriliyor...`;
    setTimeout(() => closeModal(), 800);
  }
  toast.success('Export indirildi!');
}

export function openBulkModal(initialSource) {
  if (initialSource) source = initialSource;
  const sourceGems = getSourceGems();
  selectedIds = new Set(sourceGems.map(g => g.id));
  renderModal();
}

// Wire up to gem selection
bus.on('gem:rendered', () => {
  const detail = document.getElementById('gemDetail');
  if (!detail) return;

  let expBtn = detail.querySelector('#expQuickBtn');
  if (!expBtn) {
    const hdr = detail.querySelector('.gem-hdr-top');
    if (hdr) {
      expBtn = document.createElement('button');
      expBtn.id = 'expQuickBtn';
      expBtn.className = 'copy-btn';
      expBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export`;
      hdr.appendChild(expBtn);
      expBtn.addEventListener('click', () => openBulkModal('favorites'));
    }
  }
});
