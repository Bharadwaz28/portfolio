import { motion } from 'framer-motion';

// Gentle one-time entrance when a block scrolls into view.
export default function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
