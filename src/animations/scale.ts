import { Variants } from 'framer-motion';
import { defaultTransition } from './shared';

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: defaultTransition },
  exit: { opacity: 0, scale: 0.95, transition: defaultTransition },
};