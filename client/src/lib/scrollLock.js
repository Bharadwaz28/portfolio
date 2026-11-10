// Stops the page behind a popup from scrolling. Counts users so two popups
// that overlap for a moment (one closing, one opening) do not fight each other.
let locks = 0;

export function lockScroll() {
  locks += 1;
  document.documentElement.style.overflow = 'hidden';
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.documentElement.style.overflow = '';
  };
}
