import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || React.useId();

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={`w-full bg-surface-subtle border ${
          error ? 'border-status-error focus:ring-status-error' : 'border-border-subtle focus:border-accent-primary focus:ring-accent-primary/20'
        } rounded-lg text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 outline-none focus:ring-2 p-3 disabled:opacity-50 disabled:bg-surface-elevated resize-y ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-status-error font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-tertiary">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';