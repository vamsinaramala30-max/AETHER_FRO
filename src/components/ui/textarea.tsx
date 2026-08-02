import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = typeof id === 'string' && id.trim() !== '' ? id : generatedId;
    const hasLabel = typeof label === 'string' && label.trim() !== '';
    const hasError = typeof error === 'string' && error.trim() !== '';
    const hasHelperText = typeof helperText === 'string' && helperText.trim() !== '';

    return (
      <div className="w-full space-y-1.5">
        {hasLabel && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full border bg-surface-subtle ${
            hasError
              ? 'border-status-error focus:ring-status-error'
              : 'focus:ring-accent-primary/20 border-border-subtle focus:border-accent-primary'
          } resize-y rounded-lg p-3 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-tertiary focus:ring-2 disabled:bg-surface-elevated disabled:opacity-50 ${className}`}
          {...props}
        />
        {hasError ? (
          <p className="text-xs font-medium text-status-error">{error}</p>
        ) : hasHelperText ? (
          <p className="text-xs text-text-tertiary">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
