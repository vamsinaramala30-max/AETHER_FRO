import { TargetAndTransition } from 'framer-motion';

export const cardHoverProps: TargetAndTransition = {
  y: -4,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const buttonTapProps: TargetAndTransition = {
  scale: 0.97,
};
