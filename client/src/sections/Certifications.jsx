import { BadgeCheck, ExternalLink } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { certifications } from '../data/portfolio.js';

export default function Certifications() {
  return (
    <section aria-labelledby="certifications-title" className="flex h-full flex-col">
      <SectionHeading id="certifications-title" icon={BadgeCheck}>
        Certifications
      </SectionHeading>
      <Card className="mt-4 flex-1 p-4 @[560px]:p-5">
        <ul className="space-y-5">
          {certifications.map((cert) => (
            <li key={cert.title} className="relative pl-6">
              <span
                className="absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_10px_rgba(53,220,162,0.7)]"
                aria-hidden="true"
              />
              <h3 className="font-mono text-sm font-medium leading-snug text-ink">{cert.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{cert.provider}</p>
              <p className="mt-1 font-mono text-xs text-accent">{cert.date}</p>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-sub underline-offset-4 hover:text-accent hover:underline"
                  data-log={`Open certificate: ${cert.title}`}
                >
                  View certificate <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
