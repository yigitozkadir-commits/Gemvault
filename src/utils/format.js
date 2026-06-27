import { CATEGORIES } from '../data/categories.js';

export function getCatColor(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).color || '#888';
}

export function getCatLabel(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.emoji + ' ' + c.label : id;
}

export function getCatEmoji(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).emoji || '●';
}

export function truncate(str, max = 80) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '…';
}

export function formatDate(isoStr) {
  try {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(isoStr));
  } catch {
    return isoStr;
  }
}
