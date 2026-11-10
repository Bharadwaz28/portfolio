import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Github, MessageSquare, X } from 'lucide-react';
import ProjectArt from './ProjectArt.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useLog } from '../context/LogContext.jsx';
import { projects } from '../data/portfolio.js';
import { scrollToSection } from '../lib/utils.js';
import { lockScroll } from '../lib/scrollLock.js';

export default function ProjectModal({ project }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { log } = useLog();
  const dialogRef = useRef(null);
  const fromAll = state?.from === 'all';

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  useFocusTrap(dialogRef);
  useDocumentTitle(project.shortTitle);

  const close = () => {
    log(`Closed project ${project.number}`);
    // Opened from the "All projects" popup? Go back to it.
    navigate(fromAll ? '/projects' : '/');
  };

  // Lock background scroll + keyboard shortcuts
  useEffect(() => lockScroll(), []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') {
        log(`Previous project: ${prev.shortTitle}`, 'click');
        navigate(`/projects/${prev.slug}`, { state });
      }
      if (event.key === 'ArrowRight') {
        log(`Next project: ${next.shortTitle}`, 'click');
        navigate(`/projects/${next.slug}`, { state });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug, fromAll]);

  const askAbout = () => {
    navigate('/');
    window.dispatchEvent(
      new CustomEvent('contact:prefill', { detail: { subject: `About your project: ${project.shortTitle}` } }),
    );
    setTimeout(() => scrollToSection('contact'), 150);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ y: 28, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-lg"
      >
        {/* terminal-style title bar */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line pl-4 pr-2">
          <span className="dot animate-pulse-dot" aria-hidden="true" />
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-sub">
            ~/projects/<span className="text-ink">{project.slug}</span>
          </p>
          <Link
            to={`/projects/${prev.slug}`}
            state={state}
            className="icon-btn"
            aria-label={`Previous project: ${prev.shortTitle}`}
            data-log={`Previous project: ${prev.shortTitle}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            state={state}
            className="icon-btn"
            aria-label={`Next project: ${next.shortTitle}`}
            data-log={`Next project: ${next.shortTitle}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={close} className="icon-btn" aria-label="Close project details" data-autofocus>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="label">
                  {project.number} // {project.category}
                </p>
                {project.status ? (
                  <span className="chip border-accent/40 text-accent">
                    <span className="dot mr-1.5" aria-hidden="true" />
                    {project.status}
                  </span>
                ) : null}
              </div>

              <h2 id="project-modal-title" className="mt-3 font-mono text-xl font-medium leading-snug text-ink sm:text-2xl">
                {project.title}
              </h2>

              <ProjectArt art={project.art} className="mt-5" />

              <div className="mt-5 max-w-prose space-y-3 text-[15px] leading-relaxed text-sub">
                {project.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <h3 className="label mt-6 text-accent">&gt; Highlights</h3>
              <ul className="mt-2.5 space-y-2">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span className="mt-[9px] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="label mt-6 text-accent">&gt; Tech_stack</h3>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-2.5 border-t border-line pt-5">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    data-log={`Open GitHub repo: ${project.shortTitle}`}
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View code
                  </a>
                ) : null}
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    data-log={`Open live demo: ${project.shortTitle}`}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Live demo
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={askAbout}
                  className={project.github || project.live ? 'btn btn-ghost' : 'btn btn-primary'}
                  data-log={`Ask about project ${project.number}`}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Ask about this project
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
