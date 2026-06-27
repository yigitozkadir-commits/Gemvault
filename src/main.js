import { storage } from './services/storage.js';
import { initI18n } from './app/i18n.js';
import { initRouter } from './app/router.js';
import { bus } from './app/bus.js';
import { state, setState } from './app/state.js';
import { GEMS } from './data/gems.js';

import { mountHero } from './ui/hero.js';
import { mountApiBar } from './ui/api-bar.js';
import { mountSidebar } from './ui/sidebar/sidebar.js';
import { mountGemDetail, renderDetail, generateInstr } from './ui/main/gem-detail.js';
import { showAllGrid, hideAllGrid } from './ui/main/all-grid.js';
import { showEmptyState, hideEmptyState } from './ui/main/empty-state.js';

async function boot() {
  storage.init();
  await initI18n();

  mountHero(document.getElementById('heroSection'));
  await mountApiBar(document.getElementById('apiBarSection'));
  mountSidebar(document.getElementById('sidebarSection'));
  mountFooter();
  mountScrollTop();
  mountGemDetail();

  // Wire up main content area transitions
  bus.on('tab:switch', ({ tab }) => {
    if (tab === 'generator') {
      hideEmptyState();
      hideAllGrid();
      document.getElementById('gemDetail').style.display = 'none';
      document.getElementById('radarPanel').style.display = 'none';
      renderGenPanel();
      document.getElementById('genPanel').style.display = 'block';
    } else if (tab === 'radar') {
      hideEmptyState();
      hideAllGrid();
      document.getElementById('gemDetail').style.display = 'none';
      document.getElementById('genPanel').style.display = 'none';
      loadRadar();
    } else {
      document.getElementById('radarPanel').style.display = 'none';
      document.getElementById('genPanel').style.display = 'none';
      if (state.activeGem) {
        renderDetail(state.activeGem);
      } else if (state.activeCat === 'all' && !state.searchTerm) {
        showAllGrid();
      } else {
        showEmptyState();
      }
    }
  });

  bus.on('gem:select', ({ id }) => {
    setState({ activeGem: GEMS.find((g) => g.id === id) });
    if (state.activeTab !== 'gems') {
      bus.emit('tab:switch', { tab: 'gems' });
    }
  });

  bus.on('cat:select', ({ id }) => {
    if (id === 'all' && !state.searchTerm && !state.activeGem) {
      showAllGrid();
    } else if (!state.activeGem) {
      hideAllGrid();
      showEmptyState();
    }
    bus.emit('search:change', { term: state.searchTerm });
  });

  bus.on('search:change', ({ term }) => {
    if (!state.activeGem && !term && state.activeCat === 'all') {
      showAllGrid();
    } else if (!state.activeGem) {
      hideAllGrid();
    }
  });

  bus.on('route:home', () => {
    setState({ activeGem: null, activeCat: 'all', searchTerm: '' });
    bus.emit('search:clear');
    showAllGrid();
  });

  initRouter();

  // Re-render static sections on locale change
  bus.on('locale:change', () => {
    mountHero(document.getElementById('heroSection'));
    mountApiBar(document.getElementById('apiBarSection'));
  });

  // Global keyboard shortcuts
  let gKeySeq = '';
  document.addEventListener('keydown', (e) => {
    // Skip if focus is in input/textarea/contenteditable
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

    // '/' — focus search
    if (e.key === '/') {
      e.preventDefault();
      document.querySelector('#gemSearch')?.focus();
      return;
    }

    // '?' — shortcuts panel
    if (e.key === '?') {
      import('./ui/modals/shortcuts.js').then(({ openShortcuts }) => openShortcuts());
      return;
    }

    // 'c' — copy current instruction
    if (e.key === 'c') {
      document.querySelector('.gem-copy-btn')?.click();
      return;
    }

    // chord sequences: g+g, g+r, g+f
    if (e.key === 'g') {
      if (gKeySeq === 'g') {
        gKeySeq = '';
        bus.emit('tab:switch', 'gems');
        bus.emit('cat:select', null);
      } else {
        gKeySeq = 'g';
        setTimeout(() => { gKeySeq = ''; }, 800);
      }
      return;
    }
    if (gKeySeq === 'g') {
      if (e.key === 'r') { gKeySeq = ''; bus.emit('tab:switch', 'radar'); }
      else if (e.key === 'f') { gKeySeq = ''; bus.emit('tab:switch', 'favorites'); }
      else { gKeySeq = ''; }
      return;
    }

    // j/k — navigate gem list
    if (e.key === 'j' || e.key === 'k') {
      const items = [...document.querySelectorAll('.gem-item')];
      const active = document.querySelector('.gem-item.active');
      const idx = active ? items.indexOf(active) : -1;
      const next = e.key === 'j' ? Math.min(idx + 1, items.length - 1) : Math.max(idx - 1, 0);
      items[next]?.click();
      items[next]?.scrollIntoView({ block: 'nearest' });
    }
  });

  // Initial view: show all grid
  showAllGrid();

  // Lazy load PWA update notifier
  if ('serviceWorker' in navigator) {
    import('./services/update-notifier.js').catch(() => {});
  }

  // Lazy load Molo chatbot
  setTimeout(() => {
    import('./features/molo/molo.js').then(({ initMolo }) => initMolo?.()).catch(() => {});
  }, 1000);
}

function mountFooter() {
  const footer = document.getElementById('footerSection');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-brand">Gem<em>Vault</em> <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text4)">Pro</span></div>
    <div class="footer-note">GemVault Pro · ${GEMS.length} Gem · 18 Kategori · Google Gemini AI Destekli</div>
    <button id="bulkExportBtn" class="exp-quick-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Toplu Export
    </button>`;

  footer.querySelector('#bulkExportBtn')?.addEventListener('click', () => {
    import('./features/export.js').then(({ exp_openBulkModal }) => exp_openBulkModal?.());
  });
}

function mountScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  const main = document.getElementById('mainContent');
  btn.addEventListener('click', () => main?.scrollTo({ top: 0, behavior: 'smooth' }));
  main?.addEventListener('scroll', () => {
    btn.style.opacity = main.scrollTop > 200 ? '1' : '0';
  });
}

function renderGenPanel() {
  import('./features/gem-generator.js').then(({ renderGenPanel }) => renderGenPanel?.());
}

async function loadRadar() {
  import('./features/radar/radar.js').then(({ renderRadarPanel }) => renderRadarPanel?.());
}

document.addEventListener('DOMContentLoaded', boot);
