import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Github, Plus } from 'lucide-react';
import Card from './Card.jsx';
import ProjectArt from './ProjectArt.jsx';

const MAX_BADGES = 3;

export default function ProjectCard({ project, from }) {
  const { slug, number, category, title, shortTitle, summary, tech, art, github, live } = project;
  const extra = tech.length - MAX_BADGES;

  return (
    <Card
      as="article"
      className="group flex h-full flex-col p-4 transition-colors duration-300 hover:border-accent/45"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-ink">{number}</span>
        <Plus
          className="h-4 w-4 text-muted transition-transform duration-300 group-hover:rotate-90 group-hover:text-accent"
          aria-hidden="true"
        />
      </div>
      <p className="label mt-1.5">// {category}</p>

      <h3 className="mt-2 font-mono text-[15px] font-medium leading-snug text-ink">
        {/* The link stretches over the whole card, so the full card is clickable. */}
        <Link
          to={`/projects/${slug}`}
          state={from ? { from } : undefined}
          data-log={`Open project ${number}: ${shortTitle}`}
          className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-2.5 text-[13px] leading-[1.55] text-sub">{summary}</p>

      <div className="mt-auto pt-4">
        <ProjectArt art={art} />

        <div className="mt-3 flex items-end justify-between gap-2">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {tech.slice(0, MAX_BADGES).map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
            {extra > 0 ? (
              <li className="chip text-muted" aria-label={`and ${extra} more`}>
                +{extra}
              </li>
            ) : null}
          </ul>

          <div className="relative z-10 flex shrink-0 items-center gap-1">
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn h-7 w-7"
                aria-label={`${shortTitle} on GitHub (opens in a new tab)`}
                data-log={`Open GitHub repo: ${shortTitle}`}
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn h-7 w-7"
                aria-label={`${shortTitle} live demo (opens in a new tab)`}
                data-log={`Open live demo: ${shortTitle}`}
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            <ArrowUpRight
              className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
