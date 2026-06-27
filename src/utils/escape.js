const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' };

/** HTML entity escape */
export function escH(t) {
  return String(t ?? '').replace(/[&<>"'/]/g, (c) => ESC[c]);
}

/** Tagged template that escapes all interpolated values */
export function html(strings, ...vals) {
  return strings.reduce((acc, s, i) => acc + s + (i < vals.length ? escH(vals[i]) : ''), '');
}

/** Allow raw HTML injection explicitly (caller must ensure safety) */
export function raw(val) {
  const o = Object.create(null);
  o.__raw = String(val);
  return o;
}

/** Tagged template that escapes all values UNLESS wrapped with raw() */
export function safeHtml(strings, ...vals) {
  return strings.reduce((acc, s, i) => {
    if (i < vals.length) {
      const v = vals[i];
      return acc + s + (v && typeof v === 'object' && v.__raw !== undefined ? v.__raw : escH(v));
    }
    return acc + s;
  }, '');
}
