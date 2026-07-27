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
        className={`border-border-strong text-accent-primary focus:ring-accent-primary bg-surface-subtle h-4 w-4 cursor-pointer rounded transition-all ${className}`}
        {...props}
      />
      {hasLabel && (
        <label
          htmlFor={checkboxId}
          className="text-text-primary cursor-pointer select-none text-sm"
        >
          {label}
        </label>
      )}
    </div>
  );
};
