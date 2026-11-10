import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize, Menu, Minimize, X } from 'lucide-react';
import { nav, profile } from '../data/portfolio.js';
import { useSectionNav } from '../hooks/useSectionNav.js';
import { useLog } from '../context/LogContext.jsx';
import { cn } from '../lib/utils.js';

function FullscreenButton({ className }) {
  const { log } = useLog();
  const [on, setOn] = useState(() => Boolean(document.fullscreenElement));

  useEffect(() => {
    const sync = () => setOn(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  if (!document.fullscreenEnabled) return null;

  const toggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        log('Fullscreen off');
      } else {
        await document.documentElement.requestFullscreen();
        log('Fullscreen on');
      }
    } catch {
      log('Fullscreen is blocked by the browser', 'warn');
    }
  };

  const Icon = on ? Minimize : Maximize;
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn('icon-btn', className)}
      aria-label={on ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-pressed={on}
      title={on ? 'Exit fullscreen' : 'Fullscreen'}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export default function Header({ active, sticky = false }) {
  const go = useSectionNav();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const pending = useRef(null);

  // Close the mobile menu on Escape or when clicking elsewhere.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const select = (event, id) => {
    event.preventDefault();
    if (open) {
      // Scroll only after the menu has finished closing (see onExitComplete below).
      // Starting a smooth scroll while the menu is still closing gets cancelled by the browser.
      pending.current = id;
      setOpen(false);
    } else {
      go(id);
    }
  };

  const afterMenuClosed = () => {
    if (!pending.current) return;
    go(pending.current);
    pending.current = null;
  };

  return (
    <header
      ref={rootRef}
      className={cn(
        '@container z-40 shrink-0 border-b border-line bg-panel/95 backdrop-blur',
        sticky ? 'sticky top-0' : 'relative',
      )}
    >
      <div className="flex h-14 items-center gap-3 px-4 @[640px]:px-5">
        <a
          href="#home"
          onClick={(e) => select(e, 'home')}
          data-log="Logo clicked: back to home"
          className="flex items-center gap-3 rounded"
          aria-label={`${profile.shortName}, go to home`}
        >
          <span className="font-mono text-xl font-extrabold leading-none text-accent">{profile.monogram}</span>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-ink @[600px]:hidden @[700px]:inline">
            {profile.shortName}
          </span>
        </a>
        <span className="label hidden @[900px]:inline">// {profile.tagline}</span>
        <span className="dot animate-pulse-dot" role="img" aria-label="Status: online" title="Online" />

        <nav aria-label="Primary" className="ml-auto hidden @[600px]:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => select(e, item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    data-log={`Navigate to ${item.label}`}
                    className={cn(
                      'relative block px-1.5 py-2 font-mono text-[11px] tracking-[0.08em] transition-colors duration-200',
                      isActive ? 'text-accent' : 'text-sub hover:text-ink',
                    )}
                  >
                    {item.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-1.5 bottom-0 h-px bg-accent"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <FullscreenButton className="hidden @[600px]:inline-flex" />

        <button
          type="button"
          className="icon-btn ml-auto border-line @[600px]:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-log={open ? 'Menu closed' : 'Menu opened'}
        >
          {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence onExitComplete={afterMenuClosed}>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            // Floats over the page (absolute), so opening it never pushes content down.
            className="absolute inset-x-0 top-full overflow-hidden border-b border-line bg-panel shadow-[0_24px_40px_-12px_rgba(0,0,0,0.85)] @[600px]:hidden"
          >
            <ul className="px-2 py-2">
              {nav.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => select(e, item.id)}
                      aria-current={isActive ? 'location' : undefined}
                      data-log={`Navigate to ${item.label}`}
                      className={cn(
                        'flex min-h-[44px] items-center gap-3 rounded px-3 font-mono text-sm tracking-[0.08em]',
                        isActive ? 'bg-accent/10 text-accent' : 'text-sub hover:text-ink',
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-accent' : 'bg-line')} aria-hidden="true" />
                      {item.label}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
