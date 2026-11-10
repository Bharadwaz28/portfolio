import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { projects } from '../data/portfolio.js';

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardMotion = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// The main page highlights up to three featured projects.
// The "All" button opens a large popup with every project.
const featured = projects.filter((p) => p.featured).slice(0, 3);

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="@container scroll-mt-20 xl:scroll-mt-5">
      <Reveal className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <SectionHeading id="projects-title">Selected projects</SectionHeading>

        <Link
          to="/projects"
          data-log="Open all projects"
          aria-label={`View all ${projects.length} projects`}
          className="group inline-flex min-h-[34px] items-center gap-2 rounded border border-accent/60 bg-accent/10 px-3 font-mono text-[11px] uppercase tracking-[0.1em] text-accent transition-all duration-200 hover:bg-accent/15 hover:shadow-glow"
        >
          All
          <span className="text-accent/70">({projects.length})</span>
          <Maximize2
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          />
        </Link>
      </Reveal>

      <motion.ul
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -6% 0px' }}
        className="project-grid mt-4 grid gap-3 @[440px]:grid-cols-2 @[640px]:grid-cols-3"
      >
        {featured.map((project) => (
          <motion.li key={project.slug} variants={cardMotion} className="min-w-0">
            <ProjectCard project={project} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
