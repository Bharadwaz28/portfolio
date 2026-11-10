import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, CornerDownLeft, Trash2 } from 'lucide-react';
import { useLog } from '../context/LogContext.jsx';
import { useTerminal } from '../hooks/useTerminal.js';
import { cn, formatTime, prefersReducedMotion } from '../lib/utils.js';

const TONE = {
  boot: 'text-sub',
  info: 'text-sub',
  click: 'text-ink',
  view: 'text-muted',
  ok: 'text-accent',
  warn: 'text-warn',
  error: 'text-danger',
  cmd: 'text-accent',
  out: 'text-sub',
};

// New entries are typed out; older ones are shown as plain text.
function LogLine({ entry }) {
  const total = entry.message.length;
  const [animate] = useState(() => Date.now() - entry.time.getTime() < 1200 && !prefersReducedMotion());
  const [count, setCount] = useState(animate ? 0 : total);

  useEffect(() => {
    if (!animate) return undefined;
    const step = Math.max(1, Math.ceil(total / 26));
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(total, c + step);
        if (next >= total) clearInterval(timer);
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [animate, total]);

  return (
    <p className={cn('whitespace-pre-wrap break-words', TONE[entry.type] || TONE.info)}>
      <span className="text-muted">[{formatTime(entry.time)}]</span> {entry.message.slice(0, count)}
      {count < total ? <span className="ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-accent" aria-hidden="true" /> : null}
    </p>
  );
}

function LogBody({ entries, className }) {
  // column-reverse keeps the view pinned to the newest line
  return (
    <div
      role="log"
      aria-live="off"
      aria-label="Activity log"
      tabIndex={0}
      className={cn('flex flex-col-reverse overflow-y-auto px-4 font-mono text-xs leading-5', className)}
    >
      <div className="py-1">
        {entries.length === 0 ? (
          <p className="text-muted">Log is empty. Click anything on the page, or type "help".</p>
        ) : (
          entries.map((entry) => <LogLine key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}

function CommandLine({ inputRef }) {
  const run = useTerminal();
  const [value, setValue] = useState('');
  const history = useRef([]);
  const cursor = useRef(-1);

  const onSubmit = (event) => {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    history.current = [text, ...history.current.filter((h) => h !== text)].slice(0, 30);
    cursor.current = -1;
    setValue('');
    run(text);
  };

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const dir = event.key === 'ArrowUp' ? 1 : -1;
    const next = Math.max(-1, Math.min(history.current.length - 1, cursor.current + dir));
    cursor.current = next;
    setValue(next === -1 ? '' : history.current[next]);
  };

  return (
    <form onSubmit={onSubmit} className="flex h-10 items-center gap-2 border-t border-line/70 px-4">
      <label htmlFor="terminal-input" className="shrink-0 font-mono text-xs text-accent">
        visitor@gb:~$
      </label>
      <input
        id="terminal-input"
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder='type "help"'
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={80}
        enterKeyHint="go"
        className="h-full min-w-0 flex-1 bg-transparent font-mono text-xs text-ink caret-accent placeholder:text-muted focus:outline-none"
      />
      <button type="submit" className="icon-btn h-7 w-7" aria-label="Run command">
        <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </form>
  );
}

/*
  variant="dock"   : fixed strip at the bottom of the left panel (desktop)
  variant="drawer" : bar at the bottom of the screen that expands (phones, tablets)
*/
export default function SystemLog({ variant = 'dock' }) {
  const { entries, log, clear } = useLog();
  const isDrawer = variant === 'drawer';
  const [open, setOpen] = useState(!isDrawer);
  const inputRef = useRef(null);
  const latest = entries[entries.length - 1];

  // Press "/" anywhere to jump to the command line.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      event.preventDefault();
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 60);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const onClear = () => {
    clear();
    log('Log cleared');
  };

  // The dock sits at the bottom, so "minimize" always points down and "expand" points up.
  const Chevron = open ? ChevronDown : ChevronUp;

  return (
    <section
      aria-label="System log"
      className={cn(
        'shrink-0 border-t border-line bg-bg/80',
        isDrawer && 'fixed inset-x-0 bottom-0 z-30 bg-panel/95 backdrop-blur',
      )}
    >
      <div className="flex h-10 items-center gap-2.5 pl-4 pr-2">
        <h2 className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
          &gt; System_log
        </h2>
        <span className="dot animate-pulse-dot" aria-hidden="true" />

        {isDrawer && !open ? (
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-sub" aria-hidden="true">
            {latest ? latest.message : 'ready'}
          </p>
        ) : (
          <p className="label flex-1 normal-case tracking-normal">
            live, {entries.length} {entries.length === 1 ? 'event' : 'events'}
          </p>
        )}

        {open ? (
          <button type="button" onClick={onClear} className="icon-btn h-8 w-8" aria-label="Clear log" title="Clear log">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="icon-btn h-8 w-8"
          aria-expanded={open}
          aria-controls="system-log-body"
          aria-label={open ? 'Minimize system log' : 'Expand system log'}
          title={open ? 'Minimize' : 'Expand'}
        >
          <Chevron className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="system-log-body"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <LogBody entries={entries} className={isDrawer ? 'h-[34vh]' : 'h-[104px]'} />
            <CommandLine inputRef={inputRef} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
