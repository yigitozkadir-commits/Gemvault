import { bus } from './bus.js';

export const state = {
  activeGem: null,
  activeCat: 'all',
  searchTerm: '',
  aiMode: false,
  aiIds: null,
  activeTab: 'gems',
  curInstr: '',
  genResult: null,
};

export function setState(patch) {
  Object.assign(state, patch);
  bus.emit('state:change', { ...state });
}

export function getState() {
  return { ...state };
}
