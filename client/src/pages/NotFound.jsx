import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <main id="main" className="flex min-h-dvh items-center justify-center p-6">
      <div className="card w-full max-w-md p-7 font-mono">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted">&gt; Error_404</p>
        <h1 className="mt-4 text-3xl text-ink">
          Page not <span className="text-accent">found.</span>
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-sub">
          This address does not exist on the site. The link may be old or mistyped.
        </p>
        <pre className="mt-5 overflow-x-auto rounded border border-line bg-bg p-3 text-xs leading-5 text-sub">
{`$ cd ${typeof window !== 'undefined' ? window.location.pathname : ''}
cd: no such file or directory`}
        </pre>
        <Link to="/" className="btn btn-primary mt-6" data-log="Back to home from 404">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
