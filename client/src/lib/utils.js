export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const formatTime = (date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  } catch {
    return false;
  }
}

// Smoothly scrolls to a section. Works for the page and for the scrolling panels.
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  // Tell the navigation bar right away (the panel may already be at this spot, so no scroll event fires).
  window.dispatchEvent(new CustomEvent('section:navigate', { detail: { id } }));
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });

  // "Home" resets the whole dashboard: both panels (and the page) go back to the top.
  if (id === 'home') {
    document.querySelectorAll('[data-scroll-panel]').forEach((panel) => panel.scrollTo({ top: 0, behavior }));
    window.scrollTo({ top: 0, behavior });
  }

  // Short green outline so it is clear which panel moved.
  el.classList.remove('section-flash');
  void el.offsetWidth;
  el.classList.add('section-flash');
  setTimeout(() => el.classList.remove('section-flash'), 1500);
  return true;
}
