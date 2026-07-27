import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      className = '',
      id,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = typeof id === 'string' && id.trim() !== '' ? id : generatedId;

    const hasLabel = typeof label === 'string' && label.trim() !== '';
    const hasLeftIcon = leftIcon !== undefined && leftIcon !== null;
    const hasRightIcon = rightIcon !== undefined && rightIcon !== null;
    const hasError = typeof error === 'string' && error.trim() !== '';
    const hasHelperText = typeof helperText === 'string' && helperText.trim() !== '';

    return (
      <div className="w-full space-y-1.5">
        {hasLabel && (
          <label
            htmlFor={inputId}
            className="text-text-secondary block text-xs font-semibold uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {hasLeftIcon && (
            <div className="text-text-tertiary pointer-events-none absolute left-3 flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`bg-surface-subtle w-full border ${
              hasError
                ? 'border-status-error focus:ring-status-error'
                : 'border-border-subtle focus:border-accent-primary focus:ring-accent-primary/20'
            } text-text-primary placeholder:text-text-tertiary rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2 ${
              hasLeftIcon ? 'pl-9' : 'pl-3'
            } ${hasRightIcon ? 'pr-9' : 'pr-3'} disabled:bg-surface-elevated py-2 disabled:opacity-50 ${className}`}
            {...props}
          />
          {hasRightIcon && (
            <div className="text-text-tertiary absolute right-3 flex items-center">{rightIcon}</div>
          )}
        </div>
        {hasError ? (
          <p className="text-status-error text-xs font-medium">{error}</p>
        ) : hasHelperText ? (
          <p className="text-text-tertiary text-xs">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
