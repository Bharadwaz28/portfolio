import { useEffect, useRef } from 'react';
import { useMatch } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import AllProjectsModal from '../components/AllProjectsModal.jsx';
import SystemLog from '../components/SystemLog.jsx';
import Reveal from '../components/Reveal.jsx';
import Hero from '../sections/Hero.jsx';
import Projects from '../sections/Projects.jsx';
import TechStack from '../sections/TechStack.jsx';
import About from '../sections/About.jsx';
import Experience from '../sections/Experience.jsx';
import Skills from '../sections/Skills.jsx';
import Education from '../sections/Education.jsx';
import Certifications from '../sections/Certifications.jsx';
import Involvement from '../sections/Involvement.jsx';
import Contact from '../sections/Contact.jsx';
import { CopyrightFooter, SocialFooter } from '../sections/Footers.jsx';
import NotFound from './NotFound.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { DASHBOARD_QUERY, useMediaQuery } from '../hooks/useMediaQuery.js';
import { useBooted } from '../context/BootContext.jsx';
import { useLog } from '../context/LogContext.jsx';
import { nav, projects, skillGroups } from '../data/portfolio.js';
import { scrollToSection } from '../lib/utils.js';


const SECTION_IDS = nav.map((item) => item.id);
let bootLogged = false;

export default function Home() {
  const isDashboard = useMediaQuery(DASHBOARD_QUERY);
  const booted = useBooted();
  const { log } = useLog();
  const [active] = useActiveSection(SECTION_IDS);

  const showAll = Boolean(useMatch('/projects'));
  const match = useMatch('/projects/:slug');
  const project = match ? projects.find((p) => p.slug === match.params.slug) : null;

  // Start-up lines in the system log. The counts are read from the real data.
  useEffect(() => {
    if (!booted || bootLogged) return undefined;
    const lines = [
      ['Portfolio initialized', 'boot'],
      [`Loading projects... ${projects.length} found`, 'boot'],
      [`Loading technical skills... ${skillGroups.length} groups`, 'boot'],
      ['Ready. Your clicks show up here. Type "help" for commands.', 'ok'],
    ];
    const timers = lines.map(([message, type], i) =>
      setTimeout(() => {
        log(message, type);
        if (i === lines.length - 1) bootLogged = true;
      }, 400 + i * 520),
    );
    return () => timers.forEach(clearTimeout);
  }, [booted, log]);

  // Log the section the visitor settles on (short delay avoids noise while scrolling).
  const lastLogged = useRef(active);
  useEffect(() => {
    if (active === lastLogged.current) return undefined;
    const timer = setTimeout(() => {
      lastLogged.current = active;
      const label = nav.find((item) => item.id === active)?.label || active;
      log(`Viewing ${label}`, 'view');
    }, 650);
    return () => clearTimeout(timer);
  }, [active, log]);

  // Support links like /#projects
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && SECTION_IDS.includes(id)) setTimeout(() => scrollToSection(id), 300);
  }, []);

  if (match && !project) return <NotFound />;

  return (
    <>
      {!isDashboard ? <Header active={active} sticky /> : null}

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-[1840px] bg-panel pb-12 outline-none xl:grid xl:h-dvh xl:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] xl:gap-4 xl:bg-transparent xl:p-4"
      >
        {/* LEFT PANEL: intro, projects, stack, system log */}
        <div className="xl:flex xl:min-h-0 xl:flex-col xl:overflow-hidden xl:rounded-lg xl:border xl:border-line xl:bg-panel">
          {isDashboard ? <Header active={active} /> : null}
          <div data-scroll-panel className="space-y-7 p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain xl:p-5">
            <Hero />
            {/* On phones and tablets, About comes right after the intro (same order as the menu). */}
            {!isDashboard ? <About /> : null}
            <Projects />
            <TechStack />
            <div className="hidden xl:block">
              <CopyrightFooter />
            </div>
          </div>
          {isDashboard ? <SystemLog variant="dock" /> : null}
        </div>

        {/* RIGHT PANEL: experience, skills, education, contact */}
        <div data-scroll-panel className="space-y-7 p-4 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:rounded-lg xl:border xl:border-line xl:bg-panel xl:p-5">
          {isDashboard ? <About /> : null}
          <Experience />
          <Skills />
          <Reveal className="@container">
            <div className="grid gap-7 @[560px]:grid-cols-2 @[560px]:gap-4">
              <Education />
              <Certifications />
            </div>
          </Reveal>
          <Involvement />
          <Contact />
          <SocialFooter />
          <div className="xl:hidden">
            <CopyrightFooter />
          </div>
        </div>
      </main>

      {!isDashboard ? <SystemLog variant="drawer" /> : null}

        <AnimatePresence>{showAll ? <AllProjectsModal key="all-projects" /> : null}</AnimatePresence>
        <AnimatePresence>{project ? <ProjectModal key="project-modal" project={project} /> : null}</AnimatePresence>
    </>
  );
}
