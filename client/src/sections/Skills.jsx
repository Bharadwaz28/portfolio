import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import Card from '../components/Card.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { skillGroups } from '../data/portfolio.js';

const badge = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function Group({ group }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } }}
    >
      <h3 className="font-mono text-xs text-ink">{group.title}</h3>
      {/* Decorative line only. It always draws to full width and does not show a skill level. */}
      <div className="mt-2 h-px w-full bg-line" aria-hidden="true">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-accent to-accent-dim/30"
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
          }}
        />
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {group.items.map((skill) => (
          <motion.li
            key={skill}
            variants={badge}
            className="chip transition-colors duration-200 hover:border-accent/50 hover:text-accent"
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="@container scroll-mt-20 xl:scroll-mt-5">
      <Reveal>
        <SectionHeading id="skills-title" icon={Cpu}>
          Technical skills
        </SectionHeading>
      </Reveal>
      <Card className="mt-4 p-4 @[560px]:p-5">
        <div className="grid gap-x-8 gap-y-6 @[520px]:grid-cols-2">
          {skillGroups.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      </Card>
    </section>
  );
}
