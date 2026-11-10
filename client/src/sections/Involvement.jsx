import { Users } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { involvement } from '../data/portfolio.js';

export default function Involvement() {
  return (
    <section aria-labelledby="involvement-title" className="@container">
      <Reveal>
        <SectionHeading id="involvement-title" icon={Users}>
          Leadership & involvement
        </SectionHeading>
      </Reveal>
      <ul className="mt-4 space-y-3">
        {involvement.map((item) => (
          <Reveal as="li" key={item.org}>
            <Card className="p-4 @[560px]:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-2.5 font-mono text-sm font-medium text-ink">
                  <span className="dot shadow-[0_0_10px_rgba(53,220,162,0.7)]" aria-hidden="true" />
                  {item.org}
                </h3>
                <p className="font-mono text-xs text-accent">{item.period}</p>
              </div>
              <p className="mt-1.5 pl-4 text-[13px] text-sub">{item.role}</p>
              <ul className="mt-3.5 grid gap-x-6 gap-y-2 pl-4 @[620px]:grid-cols-3">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-sub">
                    <span className="mt-[9px] h-px w-2.5 shrink-0 bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
