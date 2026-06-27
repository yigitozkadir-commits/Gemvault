import { bus } from '../../app/bus.js';
import { state } from '../../app/state.js';
import { mountTabs } from './tabs.js';
import { mountSearch } from './search.js';
import { mountCategoryList } from './category-list.js';
import { mountGemsList } from './gems-list.js';
import { renderSidebar as renderFavSidebar } from '../../features/favorites.js';
import { t } from '../../app/i18n.js';

export function mountSidebar(container) {
  container.innerHTML = `
    <div id="sidebarSearch"></div>
    <div id="sidebarTabs"></div>
    <div id="sidebarGems">
      <div id="sidebarCats"></div>
      <div id="sidebarList"></div>
    </div>
    <div id="sidebarGen" style="display:none">
      <div style="padding:16px">
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;color:var(--text4);margin-bottom:12px;text-transform:uppercase">${t('gen.sidebar.label')}</div>
        <div style="padding:14px;background:var(--bg3);border-radius:var(--radius-lg);border:1px solid var(--border2);position:relative;overflow:hidden">
          <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,var(--gold),transparent);opacity:.3"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;color:var(--gold);letter-spacing:.12em;margin-bottom:8px;display:flex;align-items:center;gap:7px"><span style="width:5px;height:5px;border-radius:50%;background:var(--gold);display:inline-block;box-shadow:0 0 8px var(--gold)"></span>${t('gen.sidebar.badge')}</div>
          <p style="font-size:11px;color:var(--text3);line-height:1.6">${t('gen.sidebar.desc')}</p>
        </div>
      </div>
    </div>
    <div id="sidebarFavs" style="display:none;flex-direction:column;flex:1;overflow-y:auto"></div>
    <div id="sidebarRadar" style="display:none;flex-direction:column">
      <div style="padding:11px 10px 6px;border-bottom:1px solid var(--border)">
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.16em;color:var(--text4);margin-bottom:8px;text-transform:uppercase">${t('radar.sidebar.label')}</div>
        <div id="radarSourceBtns"></div>
      </div>
      <div style="padding:10px;border-bottom:1px solid var(--border)">
        <button class="gen-btn" id="radarFetchBtn" style="width:100%;justify-content:center;font-size:9px;padding:9px">
          <span id="radarBtnIcon">📡</span> ${t('radar.sidebar.btn').replace('📡 ', '')}
        </button>
      </div>
      <div id="radarHistory" style="padding:8px 10px;flex:1;overflow-y:auto"></div>
    </div>`;

  mountSearch(container.querySelector('#sidebarSearch'));
  mountTabs(container.querySelector('#sidebarTabs'));
  mountCategoryList(container.querySelector('#sidebarCats'));
  mountGemsList(container.querySelector('#sidebarList'));

  bus.on('tab:switch', ({ tab }) => {
    const gemsEl = container.querySelector('#sidebarGems');
    const genEl = container.querySelector('#sidebarGen');
    const favsEl = container.querySelector('#sidebarFavs');
    const radarEl = container.querySelector('#sidebarRadar');
    gemsEl.style.display = tab === 'gems' ? '' : 'none';
    genEl.style.display = tab === 'generator' ? '' : 'none';
    favsEl.style.display = tab === 'favorites' ? 'flex' : 'none';
    radarEl.style.display = tab === 'radar' ? 'flex' : 'none';
    if (tab === 'favorites') renderFavSidebar();
  });
}
