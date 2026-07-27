import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Spinner } from './Spinner';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-accent-primary text-neutral-0 hover:bg-accent-primary-hover shadow-md shadow-accent-primary/20 active:scale-[0.98]',
      secondary:
        'bg-surface-elevated text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong active:scale-[0.98]',
      outline:
        'bg-transparent border border-border-strong text-text-primary hover:bg-surface-hover active:scale-[0.98]',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-[0.98]',
      danger:
        'bg-status-error text-neutral-0 hover:opacity-90 shadow-md shadow-status-error/20 active:scale-[0.98]',
      glow: 'bg-gradient-to-r from-accent-primary via-purple-500 to-accent-secondary text-white shadow-lg shadow-accent-primary/30 hover:brightness-110 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 space-x-1.5',
      md: 'text-sm px-4 py-2 space-x-2',
      lg: 'text-base px-6 py-3 space-x-2.5',
    };

    const hasChildren = children !== undefined && children !== null;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : leftIcon}
        {hasChildren && <span>{children}</span>}
        {!isLoading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
