import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react';
import Card from '../components/Card.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLog } from '../context/LogContext.jsx';
import { contact, links, profile } from '../data/portfolio.js';
import { copyText } from '../lib/utils.js';

// Decorative radar: rings, crosshair and a slow sweep.
function Radar() {
  return (
    <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 opacity-50" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        {[14, 28, 42].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} stroke="#20312D" strokeWidth="0.6" strokeDasharray="1.5 2.5" />
        ))}
        <path d="M50 4v92M4 50h92" stroke="#20312D" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="2" fill="#35DCA2" />
      </svg>
      <div
        className="absolute inset-0 animate-sweep rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgba(53,220,162,0.09), transparent 18%)' }}
      />
    </div>
  );
}

function ContactRow({ icon: Icon, label, children, action }) {
  return (
    <li className="flex min-h-[44px] items-center gap-3 border-t border-line/70 py-1.5 first:border-t-0">
      <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</p>
        {children}
      </div>
      {action}
    </li>
  );
}

const rowLink =
  'block truncate rounded-sm font-mono text-[13px] text-ink underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline';

export default function Contact() {
  const { toast } = useToast();
  const { log } = useLog();
  const [copied, setCopied] = useState(false);
  const githubHandle = links.github.replace(/^https?:\/\/(www\.)?/, '');

  const copyEmail = async () => {
    const ok = await copyText(profile.email);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast('Email address copied');
      log('Email address copied', 'ok');
    } else {
      toast('Could not copy. Please select the address and copy it.', { type: 'warn' });
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="@container scroll-mt-20 xl:scroll-mt-5">
      <Reveal>
        <Card className="overflow-hidden p-5 @[640px]:p-6">
          <div className="grid gap-7 @[640px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] @[640px]:gap-8">
            <div className="relative">
              <Radar />
              <p className="relative font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                <span aria-hidden="true">&gt; </span>
                {contact.eyebrow}
              </p>
              <h2
                id="contact-title"
                className="relative mt-4 font-mono text-[length:clamp(1.4rem,6cqw,2rem)] font-normal leading-[1.2] tracking-[-0.02em] text-ink @[640px]:text-[length:clamp(1.3rem,3.6cqw,2rem)]"
              >
                {contact.headingStart} <span className="text-accent">{contact.headingAccent}</span>
                <span className="animate-blink text-ink" aria-hidden="true">
                  _
                </span>
              </h2>
              <p className="relative mt-3 max-w-[42ch] text-sm leading-relaxed text-sub">{contact.text}</p>

              <ul className="relative mt-5">
                <ContactRow
                  icon={Mail}
                  label="Email"
                  action={
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="icon-btn"
                      aria-label={copied ? 'Email address copied' : 'Copy email address'}
                      title="Copy email address"
                    >
                      {copied ? <Check className="h-4 w-4 text-accent" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  }
                >
                  <a href={`mailto:${profile.email}`} className={rowLink} data-log="Open email app">
                    {profile.email}
                  </a>
                </ContactRow>

                <ContactRow icon={Phone} label="Phone">
                  <a href={profile.phone.href} className={rowLink} data-log="Call phone number">
                    {profile.phone.display}
                  </a>
                </ContactRow>

                <ContactRow
                  icon={Github}
                  label="GitHub"
                  action={<ArrowUpRight className="mr-2.5 h-4 w-4 text-muted" aria-hidden="true" />}
                >
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowLink}
                    data-log="Open GitHub profile"
                  >
                    {githubHandle}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </ContactRow>

                {links.linkedin ? (
                  <ContactRow
                    icon={Linkedin}
                    label="LinkedIn"
                    action={<ArrowUpRight className="mr-2.5 h-4 w-4 text-muted" aria-hidden="true" />}
                  >
                    <a
                      href={links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowLink}
                      data-log="Open LinkedIn profile"
                    >
                      {links.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </ContactRow>
                ) : import.meta.env.DEV ? (
                  // Only visible while developing. Hidden on the live site until a URL is set.
                  <ContactRow icon={Linkedin} label="LinkedIn (placeholder)">
                    <p className="font-mono text-[13px] text-muted">Add your URL in src/data/portfolio.js</p>
                  </ContactRow>
                ) : null}
              </ul>
            </div>

            <div className="flex min-w-0 flex-col @container">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                <span aria-hidden="true">&gt; </span>Send_message
              </p>
              <ContactForm />
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
