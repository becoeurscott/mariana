'use client';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Next.js App Router `template.js` re-mounts children on navigation,
 * so wrapping them with a motion enter/exit gives us route transitions
 * without any router hooks.
 */
export default function Template({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
