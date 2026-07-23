import { Variants } from 'framer-motion';

export const chatMessageVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
};

export const typingDotVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-3, 3, -3],
    transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
  },
};