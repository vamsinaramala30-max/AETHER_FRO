import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  const checkboxId = id || React.useId();

  return (
    <div className="flex items-center space-x-2.5">
      <input
        type="checkbox"
        id={checkboxId}
        className={`w-4 h-4 rounded border-border-strong text-accent-primary focus:ring-accent-primary bg-surface-subtle transition-all cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-text-primary cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};