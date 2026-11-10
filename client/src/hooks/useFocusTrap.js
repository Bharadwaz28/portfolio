import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps keyboard focus inside a dialog and gives it back when the dialog closes.
export function useFocusTrap(ref, active = true) {
  useEffect(() => {
    const node = ref.current;
    if (!active || !node) return undefined;

    const previous = document.activeElement;
    const first = node.querySelector('[data-autofocus]') || node.querySelector(FOCUSABLE);
    first?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, [ref, active]);
}
