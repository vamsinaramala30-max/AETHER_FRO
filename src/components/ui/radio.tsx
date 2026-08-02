import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  const generatedId = React.useId();
  const radioId = typeof id === 'string' && id.trim() !== '' ? id : generatedId;
  const hasLabel = typeof label === 'string' && label.trim() !== '';

  return (
    <div className="flex items-center space-x-2.5">
      <input
        type="radio"
        id={radioId}
        className={`h-4 w-4 cursor-pointer border-border-strong bg-surface-subtle text-accent-primary transition-all focus:ring-accent-primary ${className}`}
        {...props}
      />
      {hasLabel && (
        <label htmlFor={radioId} className="cursor-pointer select-none text-sm text-text-primary">
          {label}
        </label>
      )}
    </div>
  );
};
