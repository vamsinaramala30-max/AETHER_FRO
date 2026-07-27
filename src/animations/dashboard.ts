import { Variants } from 'framer-motion';

export const staggardContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const widgetItemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};
