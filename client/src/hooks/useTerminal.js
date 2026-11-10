import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLog } from '../context/LogContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useSectionNav } from './useSectionNav.js';
import { copyText } from '../lib/utils.js';
import { downloadResume } from '../lib/resume.js';
import { links, nav, profile, projects } from '../data/portfolio.js';

const SECTIONS = nav.map((item) => item.id);

// Small command line for the system log. Returns run(text).
export function useTerminal() {
  const { log, clear } = useLog();
  const { toast } = useToast();
  const go = useSectionNav();
  const navigate = useNavigate();

  return useCallback(
    async (raw) => {
      const input = raw.trim();
      if (!input) return;
      log(`$ ${input}`, 'cmd');

      const [cmd, ...args] = input.toLowerCase().split(/\s+/);
      const out = (message, type = 'out') => log(message, type);

      if (SECTIONS.includes(cmd)) {
        go(cmd);
        out(`Scrolling to ${cmd}`, 'ok');
        return;
      }

      switch (cmd) {
        case 'help':
          out('Sections: home, about, projects, skills, contact');
          out(`Projects: all, ls, open <1-${projects.length}>`);
          out('Other: whoami, email, github, cv, date, clear');
          break;
        case 'all':
          navigate('/projects');
          out('Opening all projects', 'ok');
          break;
        case 'ls':
          projects.forEach((p) => out(`${p.number}  ${p.shortTitle}`));
          break;
        case 'open': {
          const project = projects[Number.parseInt(args[0], 10) - 1];
          if (project) {
            navigate(`/projects/${project.slug}`);
            out(`Opening project ${project.number}: ${project.shortTitle}`, 'ok');
          } else {
            out(`Usage: open <1-${projects.length}>`, 'warn');
          }
          break;
        }
        case 'whoami':
          out(profile.fullName);
          out(`${profile.roles.join(' / ')} - ${profile.location}`);
          break;
        case 'email': {
          const ok = await copyText(profile.email);
          out(ok ? `Copied ${profile.email}` : profile.email, ok ? 'ok' : 'out');
          if (ok) toast('Email address copied');
          break;
        }
        case 'github':
          window.open(links.github, '_blank', 'noopener,noreferrer');
          out('Opening GitHub profile', 'ok');
          break;
        case 'cv':
        case 'resume': {
          const ok = await downloadResume();
          if (ok) {
            out('CV download started', 'ok');
          } else {
            out('CV is not uploaded yet', 'warn');
            toast('The CV is not uploaded yet. Please check back soon.', { type: 'warn' });
          }
          break;
        }
        case 'date':
        case 'time':
          out(new Date().toString());
          break;
        case 'clear':
          clear();
          break;
        default:
          out(`Command not found: ${cmd}. Type "help" for the list.`, 'warn');
      }
    },
    [log, clear, toast, go, navigate],
  );
}
