import { Variants } from 'framer-motion';
import { defaultTransition } from './shared';

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: defaultTransition },
  exit: { opacity: 0, transition: defaultTransition },
};
