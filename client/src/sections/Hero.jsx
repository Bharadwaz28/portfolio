import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Loader2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Clock from '../components/Clock.jsx';
import { useBooted } from '../context/BootContext.jsx';
import { useSectionNav } from '../hooks/useSectionNav.js';
import { useResumeDownload } from '../hooks/useResumeDownload.js';
import { experience, hero, profile } from '../data/portfolio.js';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Info({ label, children }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
        <span aria-hidden="true">&gt; </span>
        {label}
      </dt>
      <dd className="mt-1 pl-3.5 font-mono text-xs leading-[1.6] text-sub">{children}</dd>
    </div>
  );
}

export default function Hero() {
  const booted = useBooted();
  const go = useSectionNav();
  const { download, busy } = useResumeDownload();
  const job = experience[0];

  return (
    <section id="home" aria-labelledby="hero-title" className="@container scroll-mt-20 xl:scroll-mt-5">
      <Card className="overflow-hidden p-5 @[640px]:p-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
          className="grid items-center gap-7 @[640px]:grid-cols-[minmax(0,1.55fr)_minmax(0,0.9fr)] @[640px]:gap-8"
        >
          {/* intro */}
          <div>
            <motion.div variants={item} className="space-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              <p>
                <span aria-hidden="true">&gt; </span>
                {hero.bootLine}
              </p>
              <p>
                <span aria-hidden="true">&gt; </span>Status: <span className="font-semibold text-accent">Online</span>
              </p>
            </motion.div>

            <h1
              id="hero-title"
              className="mt-5 font-mono text-[length:clamp(1.45rem,6.4cqw,2.25rem)] font-normal leading-[1.18] tracking-[-0.02em] text-ink @[640px]:text-[length:clamp(1.6rem,4.4cqw,2.5rem)]"
            >
              {hero.headingLines.map((line) => (
                <motion.span key={line} variants={item} className="block">
                  {line}
                </motion.span>
              ))}
              <motion.span variants={item} className="block text-accent">
                {hero.headingAccent}
                <span className="ml-1 inline-block h-[0.82em] w-[0.5em] translate-y-[0.08em] animate-blink bg-accent/80" aria-hidden="true" />
              </motion.span>
            </h1>

            <motion.p variants={item} className="mt-4 max-w-[54ch] text-sm leading-relaxed text-sub @[640px]:text-[15px]">
              {hero.intro}
            </motion.p>

            <motion.div variants={item} className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => go('projects')}
                className="btn btn-primary group"
                data-log="View my work clicked"
              >
                View my work
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={download}
                disabled={busy}
                className="btn btn-ghost group"
                data-log="Download CV clicked"
              >
                Download CV
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
                )}
              </button>
            </motion.div>

            <motion.button
              variants={item}
              type="button"
              onClick={() => go('projects')}
              className="mt-6 inline-flex items-center gap-2 rounded font-mono text-[11px] uppercase tracking-[0.1em] text-accent hover:text-ink"
              data-log="Scroll to explore clicked"
            >
              <span aria-hidden="true">&gt;</span> Scroll_to_explore
              <ArrowDown className="h-3.5 w-3.5 animate-bob" aria-hidden="true" />
            </motion.button>
          </div>

          {/* quick facts */}
          <motion.div
            variants={item}
            className="border-t border-line pt-5 @[640px]:border-l @[640px]:border-t-0 @[640px]:pl-7 @[640px]:pt-0"
          >
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 @[460px]:grid-cols-3 @[640px]:grid-cols-1">
              <Info label="Who_am_I">{profile.shortName}</Info>
              <Info label="Role">
                {profile.roles.map((role) => (
                  <span key={role} className="block">
                    {role}
                  </span>
                ))}
              </Info>
              <Info label="Location">
                {profile.location}
                <span className="block text-muted">
                  <Clock timeZone={profile.timeZone} className="tabular-nums" /> IST
                </span>
              </Info>
              <Info label="Experience">
                {job.type}
                <span className="block">{job.company}</span>
              </Info>
              <Info label="Availability">
                <span className="text-ink">{profile.availability}</span>
              </Info>
            </dl>
          </motion.div>
        </motion.div>
      </Card>
    </section>
  );
}
