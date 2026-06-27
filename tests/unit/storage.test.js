import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/services/storage.js';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.init(); // run migration with clean slate
  });

  it('getFavorites returns [] by default', () => {
    expect(storage.getFavorites()).toEqual([]);
  });
  it('setFavorites and getFavorites round-trips', () => {
    storage.setFavorites([1, 2, 3]);
    expect(storage.getFavorites()).toEqual([1, 2, 3]);
  });
  it('getCollections returns [] by default', () => {
    expect(storage.getCollections()).toEqual([]);
  });
  it('patchSettings merges correctly', () => {
    storage.patchSettings({ locale: 'en' });
    storage.patchSettings({ theme: 'dark' });
    const s = storage.getSettings();
    expect(s.locale).toBe('en');
    expect(s.theme).toBe('dark');
  });
  it('clearAll removes all gv: keys', () => {
    storage.setFavorites([42]);
    storage.patchSettings({ locale: 'en' });
    storage.clearAll();
    expect(storage.getFavorites()).toEqual([]);
    expect(storage.getSettings()).toEqual({});
  });
  it('migrates old gv_favorites key to new namespace', () => {
    // Set up old-format data with schema version 1 to trigger migration
    localStorage.setItem('gv_favorites', JSON.stringify([99]));
    localStorage.setItem('gv:schema', '1');
    storage.init();
    expect(storage.getFavorites()).toContain(99);
  });
});
