import { Variants } from 'framer-motion';
import { defaultTransition } from './shared';

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: defaultTransition },
  exit: { opacity: 0, y: -8, transition: defaultTransition },
};