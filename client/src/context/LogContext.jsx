import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/*
  The system log records what the visitor does on the site.

  Two ways to add an entry:
  1. Add  data-log="Some text"  to any clickable element. Every click is logged automatically.
  2. Call  log('Some text', type)  from code (form events, commands, section changes).

  Types: boot | info | click | view | ok | warn | error | cmd | out
*/
const LogContext = createContext(null);
const MAX_ENTRIES = 150;

export function LogProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const nextId = useRef(1);

  const log = useCallback((message, type = 'info') => {
    const entry = { id: nextId.current++, time: new Date(), message: String(message), type };
    setEntries((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
    });
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  // One listener for the whole page: any click inside a [data-log] element is recorded.
  useEffect(() => {
    const onClick = (event) => {
      const el = event.target instanceof Element ? event.target.closest('[data-log]') : null;
      if (!el || el.disabled) return;
      log(el.getAttribute('data-log'), el.getAttribute('data-log-type') || 'click');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [log]);

  const value = useMemo(() => ({ entries, log, clear }), [entries, log, clear]);
  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLog() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLog must be used inside <LogProvider>');
  return ctx;
}
