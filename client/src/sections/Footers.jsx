import { Github, Linkedin, Mail } from 'lucide-react';
import Card from '../components/Card.jsx';
import { links, profile } from '../data/portfolio.js';

// Bottom of the left panel
export function CopyrightFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 font-mono text-[11px] text-muted">
      <p>
        © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
      </p>
      <p className="uppercase tracking-[0.1em]">Built with React + Node.js</p>
    </footer>
  );
}

// Bottom of the right panel
export function SocialFooter() {
  const social = [
    { label: 'GitHub', href: links.github, icon: Github, external: true },
    links.linkedin ? { label: 'LinkedIn', href: links.linkedin, icon: Linkedin, external: true } : null,
    { label: 'Email', href: `mailto:${profile.email}`, icon: Mail, external: false },
  ].filter(Boolean);

  return (
    <footer>
      <Card spotlight={false} className="flex items-center gap-4 px-5 py-3.5">
        <span className="font-mono text-xl font-extrabold text-accent" aria-hidden="true">
          {profile.monogram}
        </span>
        <p className="label flex-1">// Thanks for visiting</p>
        <ul className="flex items-center gap-1">
          {social.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="icon-btn h-10 w-10 text-ink"
                aria-label={external ? `${label} (opens in a new tab)` : label}
                title={label}
                data-log={`Footer link: ${label}`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </footer>
  );
}
