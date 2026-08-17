'use client';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered reveal. Wrap any block:
 *   <Reveal>...</Reveal>
 *   <Reveal delay={0.1} from="left">...</Reveal>
 *
 * Respects prefers-reduced-motion (fades only, no translate).
 */
export default function Reveal({
  children,
  as = 'div',
  from = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  distance = 40,
  className,
  style,
}) {
  const reduce = useReducedMotion();
  const dir = {
    up:    { x: 0, y: distance },
    down:  { x: 0, y: -distance },
    left:  { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none:  { x: 0, y: 0 },
  }[from] || { x: 0, y: distance };

  const initial = reduce ? { opacity: 0 } : { opacity: 0, ...dir };
  const animate = { opacity: 1, x: 0, y: 0 };

  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container — direct children fade in one after another. */
export function StaggerGroup({ children, delay = 0, stagger = 0.08, amount = 0.2, className, style, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, distance = 30, className, style, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </MotionTag>
  );
}
