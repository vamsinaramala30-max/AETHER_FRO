import { Variants } from 'framer-motion';

export const pulseVariants: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
};