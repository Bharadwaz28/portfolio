import { useEffect, useState } from 'react';

/*
  Tracks which section is currently being read.
  Works for normal page scrolling (mobile) and for the two independently
  scrolling panels (desktop): whichever container was scrolled last decides.
*/
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let frame = 0;
    let lockedUntil = 0;

    // A menu click wins: mark that section active now and ignore scroll tracking
    // for a moment while the smooth scroll runs.
    const onNavigate = (event) => {
      const id = event.detail?.id;
      if (!ids.includes(id)) return;
      lockedUntil = Date.now() + 1100;
      setActive(id);
    };
    window.addEventListener('section:navigate', onNavigate);

    const compute = (target) => {
      const isPage = target === document || target === document.documentElement || target === document.body;
      const container = isPage ? document.documentElement : target;
      if (!(container instanceof Element)) return;

      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el) => el && (isPage || container.contains(el)));
      if (!sections.length) return;

      const containerTop = isPage ? 0 : container.getBoundingClientRect().top;
      const line = containerTop + (isPage ? 110 : 60);

      let current = null;
      let currentTop = -Infinity;
      for (const el of sections) {
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > currentTop) {
          current = el;
          currentTop = top;
        }
      }

      // At the very bottom, the last section wins even if it never reaches the top.
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4;
      if (atBottom && container.scrollTop > 0) {
        current = sections.reduce((a, b) =>
          a.getBoundingClientRect().top > b.getBoundingClientRect().top ? a : b,
        );
      }

      if (current) setActive(current.id);
    };

    const onScroll = (event) => {
      if (Date.now() < lockedUntil) return;
      const target = event.target;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => compute(target));
    };

    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('section:navigate', onNavigate);
      document.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [ids]);

  return [active, setActive];
}
