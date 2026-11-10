import { Briefcase } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { experience } from '../data/portfolio.js';

// Small custom drawing of a web app window (not a screenshot).
function AppWindow({ title }) {
  return (
    <div className="overflow-hidden rounded border border-line bg-bg" aria-hidden="true">
      <div className="flex h-5 items-center gap-1 border-b border-line px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
        <span className="ml-2 h-1.5 flex-1 rounded-full bg-line/70" />
      </div>
      <div className="grid-texture space-y-2 p-3">
        <p className="font-mono text-[9px] font-semibold leading-tight text-ink">{title}</p>
        <span className="block h-1 w-4/5 rounded-full bg-line" />
        <span className="block h-1 w-3/5 rounded-full bg-line" />
        <div className="flex gap-1.5 pt-1">
          <span className="h-2.5 w-9 rounded-sm bg-accent/80" />
          <span className="h-2.5 w-9 rounded-sm border border-line" />
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="@container">
      <Reveal>
        <SectionHeading id="experience-title" icon={Briefcase}>
          Experience
        </SectionHeading>
      </Reveal>

      <ol className="mt-4 space-y-3">
        {experience.map((job) => (
          <Reveal as="li" key={`${job.company}-${job.role}`}>
            <Card className="p-4 @[560px]:p-5">
              <div className="grid gap-4 @[560px]:grid-cols-[auto_minmax(0,1fr)_auto] @[560px]:gap-5">
                {/* timeline rail */}
                <div className="hidden flex-col items-center @[560px]:flex">
                  <span className="font-mono text-sm text-accent">{job.number}</span>
                  <span className="mt-2 h-2 w-2 rounded-full border border-accent bg-bg shadow-[0_0_10px_rgba(53,220,162,0.6)]" aria-hidden="true" />
                  <span className="w-px flex-1 bg-gradient-to-b from-accent/60 to-transparent" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <div className="flex gap-4">
                    <div className="hidden w-32 shrink-0 @[440px]:block">
                      <AppWindow title={job.client} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-base font-medium leading-snug text-ink">{job.role}</h3>
                      <p className="mt-1 text-sm text-sub">
                        {job.company}, {job.location}
                      </p>
                      <p className="mt-1 font-mono text-xs text-accent @[560px]:hidden">
                        {job.duration} <span className="text-muted">/ {job.type}</span>
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[13.5px] leading-relaxed text-sub">
                        <span className="mt-[9px] h-px w-2.5 shrink-0 bg-accent" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                    {job.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="hidden min-w-[128px] space-y-3.5 border-l border-line pl-5 @[560px]:block">
                  <div>
                    <dt className="label text-accent">Duration</dt>
                    <dd className="mt-1 font-mono text-xs text-ink">{job.duration}</dd>
                  </div>
                  <div>
                    <dt className="label text-accent">Type</dt>
                    <dd className="mt-1 font-mono text-xs text-ink">{job.type}</dd>
                  </div>
                  <div>
                    <dt className="label text-accent">Location</dt>
                    <dd className="mt-1 font-mono text-xs text-ink">{job.location}</dd>
                  </div>
                </dl>
              </div>
            </Card>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
