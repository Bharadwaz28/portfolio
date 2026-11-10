import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useBooted } from '../context/BootContext.jsx';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: 0.25 + i * 0.25, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.25 + i * 0.25 } },
  }),
};

// Custom "GB" mark: single-stroke letters on an engineering grid.
// Replace this component with a real photo when one is available.
export default function Monogram() {
  const booted = useBooted();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 8);
    rotateY.set(px * 10);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      role="img"
      aria-label="GB monogram"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="relative mx-auto aspect-[5/6] w-full max-w-[250px] overflow-hidden rounded-md border border-line bg-bg"
    >
      <div className="grid-texture absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle at 50% 48%, rgba(53,220,162,0.16), transparent 62%)' }}
      />
      {/* slow scan line */}
      <div
        className="absolute inset-x-0 top-0 h-[9%] animate-scan bg-gradient-to-b from-transparent via-accent/10 to-transparent"
        aria-hidden="true"
      />

      {/* corner brackets */}
      <span className="absolute left-[11%] top-[13%] h-3.5 w-3.5 border-l-2 border-t-2 border-accent-dim" aria-hidden="true" />
      <span className="absolute right-[11%] top-[13%] h-3.5 w-3.5 border-r-2 border-t-2 border-accent-dim" aria-hidden="true" />
      <span className="absolute bottom-[13%] left-[11%] h-3.5 w-3.5 border-b-2 border-l-2 border-accent-dim" aria-hidden="true" />
      <span className="absolute bottom-[13%] right-[11%] h-3.5 w-3.5 border-b-2 border-r-2 border-accent-dim" aria-hidden="true" />

      <svg
        viewBox="0 0 190 120"
        className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        fill="none"
        stroke="#35DCA2"
        strokeWidth="15"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ filter: 'drop-shadow(0 0 9px rgba(53,220,162,0.65)) drop-shadow(0 0 28px rgba(53,220,162,0.3))' }}
      >
        <motion.path
          d="M80 18H24Q8 18 8 34V86Q8 102 24 102H64Q80 102 80 86V62H46"
          variants={draw}
          custom={0}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
        />
        <motion.path
          d="M112 60H160Q175 60 175 46V32Q175 18 160 18H112V102H164Q181 102 181 86V76Q181 60 164 60"
          variants={draw}
          custom={1}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
        />
      </svg>
    </motion.div>
  );
}
