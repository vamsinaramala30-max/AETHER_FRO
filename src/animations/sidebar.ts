import { Variants } from 'framer-motion';
import { defaultTransition } from './shared';

export const sidebarExpandVariants: Variants = {
  expanded: { width: '260px', transition: defaultTransition },
  collapsed: { width: '80px', transition: defaultTransition },
};
