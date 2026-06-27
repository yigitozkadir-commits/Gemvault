export const visuallyHidden =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';

const FOCUSABLE =
  'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab/Shift+Tab focus inside containerEl.
 * Returns a cleanup function that removes the listener.
 */
export function trapFocus(containerEl) {
  function getFocusable() {
    return [...containerEl.querySelectorAll(FOCUSABLE)].filter(
      (n) => !n.disabled
    );
  }

  function handler(e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  containerEl.addEventListener('keydown', handler);
  // Move focus into the container
  const focusable = getFocusable();
  if (focusable.length) focusable[0].focus();

  return () => containerEl.removeEventListener('keydown', handler);
}

let _liveRegion = null;

function getLiveRegion(politeness) {
  if (!_liveRegion) {
    _liveRegion = document.getElementById('a11y-live');
    if (!_liveRegion) {
      _liveRegion = document.createElement('div');
      _liveRegion.id = 'a11y-live';
      _liveRegion.setAttribute('style', visuallyHidden);
      _liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(_liveRegion);
    }
  }
  _liveRegion.setAttribute('aria-live', politeness || 'polite');
  return _liveRegion;
}

/**
 * Announce a message via aria-live region.
 * politeness: 'polite' (default) | 'assertive'
 */
export function announce(msg, politeness = 'polite') {
  const region = getLiveRegion(politeness);
  region.textContent = '';
  // Small delay so screen readers notice the change
  requestAnimationFrame(() => {
    region.textContent = msg;
    setTimeout(() => { region.textContent = ''; }, 3000);
  });
}

export function ariaExpanded(el, val) {
  el?.setAttribute('aria-expanded', String(val));
}

export function ariaHidden(el, val) {
  el?.setAttribute('aria-hidden', String(val));
}
