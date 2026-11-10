import { useCallback, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { BootContext } from './context/BootContext.jsx';
import { LogProvider } from './context/LogContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import BootScreen from './components/BootScreen.jsx';
import Toasts from './components/Toasts.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import { prefersReducedMotion } from './lib/utils.js';

const BOOT_KEY = 'gb_booted';

// The intro plays once per browser session and never for reduced-motion users.
function shouldSkipBoot() {
  try {
    return prefersReducedMotion() || sessionStorage.getItem(BOOT_KEY) === '1';
  } catch {
    return true;
  }
}

export default function App() {
  const [booted, setBooted] = useState(shouldSkipBoot);

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      /* private mode: ignore */
    }
    setBooted(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BootContext.Provider value={booted}>
        <ToastProvider>
          <LogProvider>
            <a
              href="#main"
              className="sr-only z-[90] rounded border border-accent bg-panel px-4 py-2 font-mono text-xs text-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>

            <Routes>
              <Route path="/" element={<Home />}>
                <Route index element={null} />
                <Route path="projects" element={null} />
                <Route path="projects/:slug" element={null} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toasts />
            <AnimatePresence>{!booted ? <BootScreen key="boot" onDone={finishBoot} /> : null}</AnimatePresence>
          </LogProvider>
        </ToastProvider>
      </BootContext.Provider>
    </MotionConfig>
  );
}
