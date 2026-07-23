import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  glassmorphism?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  glassmorphism = true,
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`rounded-xl border border-border-subtle p-5 transition-all duration-200 ${
        glassmorphism ? 'bg-surface-base/80 backdrop-blur-md' : 'bg-surface-elevated'
      } ${hoverable ? 'hover:border-border-strong hover:shadow-lg hover:shadow-black/5 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};