import type { Transition } from 'framer-motion';

export const defaultEavesdropEase = [0.4, 0, 0.2, 1] as const;

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const defaultTransition: Transition = {
  duration: 0.25,
  ease: defaultEavesdropEase,
};
