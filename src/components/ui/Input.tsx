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
            className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {hasLeftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full border bg-surface-subtle ${
              hasError
                ? 'border-status-error focus:ring-status-error'
                : 'focus:ring-accent-primary/20 border-border-subtle focus:border-accent-primary'
            } rounded-lg text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-tertiary focus:ring-2 ${
              hasLeftIcon ? 'pl-9' : 'pl-3'
            } ${hasRightIcon ? 'pr-9' : 'pr-3'} py-2 disabled:bg-surface-elevated disabled:opacity-50 ${className}`}
            {...props}
          />
          {hasRightIcon && (
            <div className="absolute right-3 flex items-center text-text-tertiary">{rightIcon}</div>
          )}
        </div>
        {hasError ? (
          <p className="text-xs font-medium text-status-error">{error}</p>
        ) : hasHelperText ? (
          <p className="text-xs text-text-tertiary">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
