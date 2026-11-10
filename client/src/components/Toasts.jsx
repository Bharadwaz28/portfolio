import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CircleCheck, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

const ICONS = { ok: CircleCheck, warn: AlertTriangle, error: AlertTriangle, info: Info };
const TONES = { ok: 'text-accent', warn: 'text-warn', error: 'text-danger', info: 'text-sub' };

export default function Toasts() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-14 z-[70] flex flex-col items-end gap-2 xl:bottom-6 xl:right-6 xl:left-auto"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-line bg-card/95 px-3.5 py-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TONES[t.type] || TONES.info}`} aria-hidden="true" />
              <p className="flex-1 text-sm leading-5 text-ink">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
