import { Variants } from 'framer-motion';
import { springTransition } from './shared';

export const drawerRightVariants: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: springTransition },
  exit: { x: '100%', transition: springTransition },
};