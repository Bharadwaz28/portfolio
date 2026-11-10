import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ProjectCard from './ProjectCard.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useLog } from '../context/LogContext.jsx';
import { lockScroll } from '../lib/scrollLock.js';
import { projects } from '../data/portfolio.js';

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } };
const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Large popup that shows every project as a card.
export default function AllProjectsModal() {
  const navigate = useNavigate();
  const { log } = useLog();
  const dialogRef = useRef(null);

  useFocusTrap(dialogRef);
  useDocumentTitle('All projects');
  useEffect(() => lockScroll(), []);

  const close = () => {
    log('Closed all projects');
    navigate('/');
  };

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-projects-title"
        initial={{ y: 28, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex h-[94dvh] w-full max-w-[1400px] flex-col overflow-hidden rounded-t-lg border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:h-[90dvh] sm:rounded-lg"
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line pl-5 pr-2.5">
          <span className="dot animate-pulse-dot" aria-hidden="true" />
          <h2 id="all-projects-title" className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-ink">
            <span className="text-accent" aria-hidden="true">// </span>All projects
          </h2>
          <span className="chip">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
          <p className="label ml-auto hidden normal-case tracking-normal sm:block">Select a card for details</p>
          <button
            type="button"
            onClick={close}
            className="icon-btn ml-auto sm:ml-2"
            aria-label="Close all projects"
            data-autofocus
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="@container flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <motion.ul
            variants={grid}
            initial="hidden"
            animate="show"
            className="grid gap-4 @[620px]:grid-cols-2 @[980px]:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.li key={project.slug} variants={cardMotion} className="min-w-0">
                <ProjectCard project={project} from="all" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
