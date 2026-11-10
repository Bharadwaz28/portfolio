import Card from '../components/Card.jsx';
import Reveal from '../components/Reveal.jsx';
import { techStack } from '../data/portfolio.js';

function Row({ hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center gap-2.5 pr-2.5" aria-hidden={hidden || undefined}>
      {techStack.map((name) => (
        <li key={name} className="chip gap-2 whitespace-nowrap px-2.5 py-1 text-xs text-ink">
          <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
          {name}
        </li>
      ))}
    </ul>
  );
}

// Slow scrolling strip of the main technologies. Pauses on hover and for reduced motion.
export default function TechStack() {
  return (
    <Reveal as="section" aria-labelledby="stack-title">
      <Card spotlight={false} className="flex items-center gap-4 overflow-hidden py-3.5 pl-4">
        <h2 id="stack-title" className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
          &gt; Tech_stack
        </h2>
        <div className="mask-fade-x group flex min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <Row />
            <Row hidden />
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
