import { useState } from 'react';
import { User } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { about, profile } from '../data/portfolio.js';

// Photo frame. Shows profile.photo when set, otherwise the GB mark.
function Portrait() {
  const [failed, setFailed] = useState(false);
  const showPhoto = profile.photo && !failed;

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-md border border-line bg-bg">
      {showPhoto ? (
        <img
          src={profile.photo}
          alt={`Portrait of ${profile.displayName}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid-texture flex h-full w-full flex-col items-center justify-center" role="img" aria-label="GB monogram">
          <span className="font-mono text-5xl font-extrabold text-accent text-glow">{profile.monogram}</span>
          {import.meta.env.DEV ? (
            <span className="mt-3 px-3 text-center font-mono text-[10px] leading-4 text-muted">
              Add public/profile.jpg and set photo in portfolio.js
            </span>
          ) : null}
        </div>
      )}

      {/* corner brackets */}
      <span className="absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l-2 border-t-2 border-accent" aria-hidden="true" />
      <span className="absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r-2 border-t-2 border-accent" aria-hidden="true" />
      <span className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-accent" aria-hidden="true" />
      <span className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-accent" aria-hidden="true" />
    </div>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="@container scroll-mt-20 xl:scroll-mt-5">
      <Reveal>
        <SectionHeading id="about-title" icon={User}>
          About
        </SectionHeading>
      </Reveal>

      <Reveal>
        <Card className="mt-4 p-4 @[560px]:p-5">
          <div className="grid items-center gap-6 @[480px]:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            <Portrait />

            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                <span aria-hidden="true">&gt; </span>Who_am_I
              </p>
              <h3 className="mt-2 font-mono text-lg font-medium leading-snug text-ink">{profile.fullName}</h3>
              <p className="mt-1 font-mono text-xs text-sub">{profile.roles.join(' / ')}</p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-sub">
                {about.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 @[560px]:grid-cols-4">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label text-accent">{fact.label}</dt>
                <dd className="mt-1 font-mono text-xs leading-5 text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Reveal>
    </section>
  );
}
