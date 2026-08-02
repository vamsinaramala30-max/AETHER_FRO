import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  const generatedId = React.useId();
  const checkboxId = typeof id === 'string' && id.trim() !== '' ? id : generatedId;
  const hasLabel = typeof label === 'string' && label.trim() !== '';

  return (
    <div className="flex items-center space-x-2.5">
      <input
        type="checkbox"
        id={checkboxId}
        className={`h-4 w-4 cursor-pointer rounded border-border-strong bg-surface-subtle text-accent-primary transition-all focus:ring-accent-primary ${className}`}
        {...props}
      />
      {hasLabel && (
        <label
          htmlFor={checkboxId}
          className="cursor-pointer select-none text-sm text-text-primary"
        >
          {label}
        </label>
      )}
    </div>
  );
};
