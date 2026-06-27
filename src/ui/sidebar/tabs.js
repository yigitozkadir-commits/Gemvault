import { bus } from '../../app/bus.js';
import { setState, state } from '../../app/state.js';
import { t } from '../../app/i18n.js';

export function mountTabs(container) {
  container.innerHTML = `
    <div class="s-tabs">
      <button class="s-tab active" data-tab="gems">${t('tab.gems')}</button>
      <button class="s-tab" data-tab="generator">${t('tab.generator')}</button>
      <button class="s-tab" data-tab="favorites">${t('tab.favorites')}</button>
      <button class="s-tab" data-tab="radar" id="radarTab">${t('tab.radar')}</button>
    </div>`;

  container.querySelectorAll('.s-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      container.querySelectorAll('.s-tab').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setState({ activeTab: tab });
      bus.emit('tab:switch', { tab });
    });
  });

  bus.on('tab:switch', ({ tab }) => {
    container.querySelectorAll('.s-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
  });
}
