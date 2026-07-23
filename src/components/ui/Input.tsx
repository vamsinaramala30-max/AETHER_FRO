import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || React.useId();

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-text-tertiary flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full bg-surface-subtle border ${
            error ? 'border-status-error focus:ring-status-error' : 'border-border-subtle focus:border-accent-primary focus:ring-accent-primary/20'
          } rounded-lg text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 outline-none focus:ring-2 ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} py-2 disabled:opacity-50 disabled:bg-surface-elevated ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-text-tertiary flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-status-error font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-tertiary">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';