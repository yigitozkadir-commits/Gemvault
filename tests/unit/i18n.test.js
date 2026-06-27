import { describe, it, expect } from 'vitest';
import trLocale from '../../src/locales/tr.js';
import enLocale from '../../src/locales/en.js';

describe('i18n locale files', () => {
  it('tr locale has keys', () => {
    expect(Object.keys(trLocale).length).toBeGreaterThan(50);
  });
  it('en locale has keys', () => {
    expect(Object.keys(enLocale).length).toBeGreaterThan(50);
  });
  it('all tr keys exist in en', () => {
    const enKeys = new Set(Object.keys(enLocale));
    for (const key of Object.keys(trLocale)) {
      expect(enKeys.has(key), `key "${key}" in tr but not in en`).toBe(true);
    }
  });
  it('all en keys exist in tr', () => {
    const trKeys = new Set(Object.keys(trLocale));
    for (const key of Object.keys(enLocale)) {
      expect(trKeys.has(key), `key "${key}" in en but not in tr`).toBe(true);
    }
  });
  it('no key has empty value in tr', () => {
    for (const [k, v] of Object.entries(trLocale)) {
      expect(v, `tr key "${k}" is empty`).toBeTruthy();
    }
  });
});
