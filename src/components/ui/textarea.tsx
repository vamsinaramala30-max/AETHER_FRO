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
            className="text-text-secondary block text-xs font-semibold uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`bg-surface-subtle w-full border ${
            hasError
              ? 'border-status-error focus:ring-status-error'
              : 'border-border-subtle focus:border-accent-primary focus:ring-accent-primary/20'
          } text-text-primary placeholder:text-text-tertiary disabled:bg-surface-elevated resize-y rounded-lg p-3 text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-50 ${className}`}
          {...props}
        />
        {hasError ? (
          <p className="text-status-error text-xs font-medium">{error}</p>
        ) : hasHelperText ? (
          <p className="text-text-tertiary text-xs">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
