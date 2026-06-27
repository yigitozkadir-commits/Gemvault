export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const on = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);
export const off = (el, ev, fn) => el?.removeEventListener(ev, fn);

export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on') && typeof v === 'function') {
      e.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class') {
      e.className = v;
    } else {
      e.setAttribute(k, v);
    }
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    e.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return e;
}

export function setInner(node, htmlStr) {
  if (typeof node === 'string') node = qs(node);
  if (node) node.innerHTML = htmlStr;
}

export function show(node) {
  if (typeof node === 'string') node = qs(node);
  if (node) node.style.display = '';
}

export function hide(node) {
  if (typeof node === 'string') node = qs(node);
  if (node) node.style.display = 'none';
}
