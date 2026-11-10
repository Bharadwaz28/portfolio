import { GraduationCap } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { education } from '../data/portfolio.js';

export default function Education() {
  return (
    <section aria-labelledby="education-title" className="flex h-full flex-col">
      <SectionHeading id="education-title" icon={GraduationCap}>
        Education
      </SectionHeading>
      <Card className="mt-4 flex-1 p-4 @[560px]:p-5">
        <ol className="relative space-y-5">
          <span className="absolute bottom-2 left-[3px] top-2 w-px bg-line" aria-hidden="true" />
          {education.map((item) => (
            <li key={item.school} className="relative pl-6">
              <span
                className="absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_10px_rgba(53,220,162,0.7)]"
                aria-hidden="true"
              />
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm font-medium leading-snug text-ink">{item.school}</h3>
                <p className="shrink-0 text-right font-mono text-xs text-accent">
                  {item.year}
                  {item.yearNote ? <span className="block text-[10px] text-muted">{item.yearNote}</span> : null}
                </p>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{item.degree}</p>
              <p className="mt-1 font-mono text-xs text-ink">{item.result}</p>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
