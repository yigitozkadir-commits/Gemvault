import { GEMS } from '../data/gems.js';
import { storage } from '../services/storage.js';
import { toast } from '../ui/toast.js';
import { bus } from '../app/bus.js';
import { getCatColor } from '../utils/format.js';
import { escH } from '../utils/escape.js';

export function toggleFav(gemId) {
  const favs = storage.getFavorites();
  const idx = favs.indexOf(gemId);
  if (idx === -1) favs.push(gemId);
  else favs.splice(idx, 1);
  storage.setFavorites(favs);
  updateHeartBtn(gemId);
  const container = document.getElementById('sidebarFavs');
  if (container?.style.display !== 'none') renderSidebar();
  bus.emit('favorites:change', { favorites: favs });
}

export function isFav(gemId) {
  return storage.getFavorites().includes(gemId);
}

export function updateHeartBtn(gemId) {
  const btn = document.getElementById('favHeartBtn');
  if (!btn) return;
  const active = isFav(gemId);
  btn.className = 'fav-heart-btn' + (active ? ' active' : '');
  btn.innerHTML = active
    ? `<svg viewBox="0 0 24 24" fill="currentColor" style="width:11px;height:11px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Favoride`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> Favoriye Ekle`;
}

export function renderSidebar() {
  const container = document.getElementById('sidebarFavs');
  if (!container) return;

  const favs = storage.getFavorites();
  const favGems = favs.map(id => GEMS.find(g => g.id === id)).filter(Boolean);

  let html_str = `<div class="fav-section">
    <div class="fav-section-hdr">
      <span class="fav-section-label">Favoriler · ${favGems.length}</span>
    </div>`;

  if (!favGems.length) {
    html_str += `<div class="fav-empty">♡ Henüz favori yok<br><span style="font-size:9px">Gem detayında kalp butonuna bas</span></div>`;
  } else {
    html_str += `<div class="gems-list">`;
    favGems.forEach(g => {
      const cc = getCatColor(g.cat);
      html_str += `<div class="fav-gem-item" data-id="${g.id}" style="--cc:${cc}">
        <span class="gem-no">${g.no}</span>
        <div class="gem-info">
          <div class="gem-name">${escH(g.name)}</div>
          <div class="gem-desc-s">${escH(g.desc)}</div>
        </div>
        <button class="fav-rm" title="Favoriden çıkar">✕</button>
      </div>`;
    });
    html_str += `</div>`;
  }
  html_str += `</div>`;

  html_str += renderCollections();

  container.innerHTML = html_str;

  container.querySelectorAll('.fav-gem-item').forEach(el => {
    el.addEventListener('click', () => {
      const gem = GEMS.find(g => g.id === parseInt(el.dataset.id));
      if (gem) bus.emit('gem:select', { id: gem.id });
    });
    el.querySelector('.fav-rm')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const gemId = parseInt(el.dataset.id);
      toggleFav(gemId);
    });
  });

  setupCollectionListeners();
}

function renderCollections() {
  const cols = storage.getCollections();
  let html_str = `<div class="fav-section">
    <div class="fav-section-hdr">
      <span class="fav-section-label">Koleksiyonlar</span>
      <button class="fav-add-col-btn">+ Yeni</button>
    </div>`;

  if (!cols.length) {
    html_str += `<div class="fav-empty">Koleksiyon yok<br><span style="font-size:9px">Gem'leri grupla</span></div>`;
  } else {
    cols.forEach(col => {
      const colGems = col.gems.map(id => GEMS.find(g => g.id === id)).filter(Boolean);
      html_str += `<div class="col-item">
        <div class="col-hdr">
          <span class="col-chevron">›</span>
          <span class="col-name">${escH(col.name)}</span>
          <span class="col-count">${colGems.length}</span>
          <button class="col-del-btn" title="Koleksiyonu sil">✕</button>
        </div>
        <div class="col-body">`;
      if (!colGems.length) {
        html_str += `<div style="padding:8px 13px;font-family:'DM Mono',monospace;font-size:9px;color:var(--text4)">Boş koleksiyon</div>`;
      } else {
        colGems.forEach(g => {
          const cc = getCatColor(g.cat);
          html_str += `<div class="fav-gem-item" data-id="${g.id}" style="--cc:${cc}">
            <span class="gem-no">${g.no}</span>
            <div class="gem-info">
              <div class="gem-name">${escH(g.name)}</div>
            </div>
            <button class="fav-rm" title="Koleksiyondan çıkar">✕</button>
          </div>`;
        });
      }
      html_str += `</div></div>`;
    });
  }
  html_str += `</div>`;

  return html_str;
}

function setupCollectionListeners() {
  const container = document.getElementById('sidebarFavs');
  if (!container) return;

  container.querySelector('.fav-add-col-btn')?.addEventListener('click', showNewColModal);

  container.querySelectorAll('.col-hdr').forEach(hdr => {
    hdr.addEventListener('click', (e) => {
      if (e.target.classList.contains('col-del-btn')) return;
      const body = hdr.nextElementSibling;
      if (body?.classList.contains('col-body')) {
        const open = body.classList.toggle('open');
        hdr.querySelector('.col-chevron')?.classList.toggle('open', open);
      }
    });

    hdr.querySelector('.col-del-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const colItem = hdr.closest('.col-item');
      const colIdx = Array.from(container.querySelectorAll('.col-item')).indexOf(colItem);
      const cols = storage.getCollections();
      if (colIdx >= 0 && cols[colIdx]) {
        const colId = cols[colIdx].id;
        const cols_new = cols.filter(c => c.id !== colId);
        storage.setCollections(cols_new);
        renderSidebar();
      }
    });
  });

  container.querySelectorAll('.col-body .fav-rm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gemItem = btn.closest('.fav-gem-item');
      const gemId = parseInt(gemItem.dataset.id);
      const colItem = btn.closest('.col-item');
      const colIdx = Array.from(container.querySelectorAll('.col-item')).indexOf(colItem);
      const cols = storage.getCollections();
      if (colIdx >= 0 && cols[colIdx]) {
        cols[colIdx].gems = cols[colIdx].gems.filter(g => g !== gemId);
        storage.setCollections(cols);
        renderSidebar();
      }
    });
  });

  container.querySelectorAll('.col-body .fav-gem-item').forEach(el => {
    el.addEventListener('click', () => {
      const gem = GEMS.find(g => g.id === parseInt(el.dataset.id));
      if (gem) bus.emit('gem:select', { id: gem.id });
    });
  });
}

function showNewColModal() {
  const existing = document.getElementById('favModalOverlay');
  if (existing) existing.remove();

  const modal_html = `<div id="favModalOverlay" class="fav-modal-overlay">
    <div class="fav-modal">
      <div class="fav-modal-title">Yeni Koleksiyon</div>
      <input id="favModalInput" type="text" placeholder="Koleksiyon adı..." autofocus>
      <div class="fav-modal-btns">
        <button class="fav-modal-cancel">İptal</button>
        <button class="fav-modal-ok">Oluştur</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modal_html);

  const overlay = document.getElementById('favModalOverlay');
  const input = document.getElementById('favModalInput');
  const cancelBtn = overlay.querySelector('.fav-modal-cancel');
  const okBtn = overlay.querySelector('.fav-modal-ok');

  const confirm = () => {
    const name = input.value.trim();
    if (name) {
      const cols = storage.getCollections();
      cols.push({ id: Date.now(), name, gems: [] });
      storage.setCollections(cols);
      closeNewColModal();
      renderSidebar();
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirm();
    if (e.key === 'Escape') closeNewColModal();
  });

  cancelBtn.addEventListener('click', closeNewColModal);
  okBtn.addEventListener('click', confirm);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNewColModal();
  });

  setTimeout(() => input.focus(), 50);
}

function closeNewColModal() {
  document.getElementById('favModalOverlay')?.remove();
}

export function showColPicker(gemId, anchorEl) {
  closeColPicker();
  const cols = storage.getCollections();
  const rect = anchorEl.getBoundingClientRect();

  let items_html = cols.map(c =>
    `<div class="fav-col-picker-item" data-col-id="${c.id}">
      <span class="dot"></span>${escH(c.name)}
    </div>`
  ).join('');
  items_html += `<div class="fav-col-picker-item fav-col-picker-new">+ Yeni Koleksiyon</div>`;

  const picker = document.createElement('div');
  picker.id = 'favColPicker';
  picker.className = 'fav-col-picker';
  picker.style.cssText = `position:fixed;top:${rect.bottom + 6}px;left:${rect.left}px;z-index:10000`;
  picker.innerHTML = items_html;
  document.body.appendChild(picker);

  picker.querySelectorAll('.fav-col-picker-item').forEach((item, idx) => {
    if (idx < cols.length) {
      item.addEventListener('click', () => {
        const colId = cols[idx].id;
        addGemToCollection(colId, gemId);
        closeColPicker();
      });
    } else {
      item.addEventListener('click', () => {
        showNewColModal();
        closeColPicker();
      });
    }
  });

  setTimeout(() => {
    document.addEventListener('click', closeColPicker, { once: true });
  }, 50);
}

export function closeColPicker() {
  document.getElementById('favColPicker')?.remove();
}

export function addGemToCollection(colId, gemId) {
  const cols = storage.getCollections();
  const col = cols.find(c => c.id === colId);
  if (!col) return;
  if (!col.gems.includes(gemId)) col.gems.push(gemId);
  storage.setCollections(cols);
  const container = document.getElementById('sidebarFavs');
  if (container?.style.display !== 'none') renderSidebar();
  toast.info(`Koleksiyona eklendi: ${col.name}`);
}

export function injectDetailButtons(gemId) {
  const hdrTop = document.querySelector('.gem-hdr-top');
  if (!hdrTop || hdrTop.querySelector('#favHeartBtn')) return;

  const isFav_val = isFav(gemId);

  const heartBtn = document.createElement('button');
  heartBtn.id = 'favHeartBtn';
  heartBtn.className = 'fav-heart-btn' + (isFav_val ? ' active' : '');
  heartBtn.innerHTML = isFav_val
    ? `<svg viewBox="0 0 24 24" fill="currentColor" style="width:11px;height:11px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Favoride`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> Favoriye Ekle`;
  heartBtn.addEventListener('click', () => toggleFav(gemId));

  const colBtn = document.createElement('button');
  colBtn.className = 'fav-heart-btn';
  colBtn.style.cssText = 'margin-left:6px';
  colBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M12 5v14M5 12h14"/></svg> Koleksiyona Ekle`;
  colBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showColPicker(gemId, colBtn);
  });

  const copyBtn = hdrTop.querySelector('#copyBtn, .copy-btn');
  if (copyBtn) {
    hdrTop.insertBefore(heartBtn, copyBtn);
    hdrTop.insertBefore(colBtn, copyBtn);
  } else {
    hdrTop.appendChild(heartBtn);
    hdrTop.appendChild(colBtn);
  }
}
