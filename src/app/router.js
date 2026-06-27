import { bus } from './bus.js';
import { GEMS } from '../data/gems.js';

const routes = [
  { pattern: /^#\/gem\/(\d+)$/, handler: (m) => bus.emit('gem:select', { id: parseInt(m[1]) }) },
  { pattern: /^#\/cat\/([^/]+)$/, handler: (m) => bus.emit('cat:select', { id: m[1] }) },
  { pattern: /^#\/generator$/, handler: () => bus.emit('tab:switch', { tab: 'generator' }) },
  { pattern: /^#\/radar$/, handler: () => bus.emit('tab:switch', { tab: 'radar' }) },
  { pattern: /^#\/favorites$/, handler: () => bus.emit('tab:switch', { tab: 'favorites' }) },
  { pattern: /^#\/settings$/, handler: () => bus.emit('modal:open', { id: 'settings' }) },
  { pattern: /^#\/about$/, handler: () => bus.emit('modal:open', { id: 'about' }) },
  { pattern: /^#\/?$/, handler: () => bus.emit('route:home') },
];

function handleRoute() {
  const hash = window.location.hash || '#/';
  for (const { pattern, handler } of routes) {
    const m = hash.match(pattern);
    if (m) { handler(m); return; }
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function gemUrl(gem) {
  return `#/gem/${gem.id}`;
}
