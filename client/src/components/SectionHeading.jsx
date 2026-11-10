import { cn } from '../lib/utils.js';

// "// TITLE" heading used by every section.
export default function SectionHeading({ id, icon: Icon, children, className }) {
  return (
    <h2
      id={id}
      className={cn(
        'flex items-center gap-2.5 font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-ink',
        className,
      )}
    >
      {Icon ? <Icon className="h-4 w-4 text-accent" aria-hidden="true" /> : null}
      <span className="text-accent" aria-hidden="true">
        //
      </span>
      <span>{children}</span>
    </h2>
  );
}
