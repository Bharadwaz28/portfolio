import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { hero } from '../data/portfolio.js';

const STEPS = [`> ${hero.bootLine}`, '> loading interface', '> STATUS: ONLINE'];

// Short intro shown once per browser session. Any key or click skips it.
export default function BootScreen({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 380),
      setTimeout(() => setStep(2), 1050),
      setTimeout(onDone, 1500),
    ];
    const skip = () => onDone();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="w-full max-w-sm font-mono text-xs">
        <p className="mb-5 text-3xl font-extrabold text-accent text-glow">GB</p>
        <div className="min-h-[66px] space-y-1.5 text-sub">
          {STEPS.slice(0, step + 1).map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={i === 2 ? 'text-accent' : undefined}
            >
              {line}
            </motion.p>
          ))}
        </div>
        <div className="mt-4 h-px w-full overflow-hidden bg-line">
          <motion.div
            className="h-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted">Press any key to skip</p>
      </div>
    </motion.div>
  );
}
