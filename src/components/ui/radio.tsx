import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  const radioId = id || React.useId();

  return (
    <div className="flex items-center space-x-2.5">
      <input
        type="radio"
        id={radioId}
        className={`w-4 h-4 border-border-strong text-accent-primary focus:ring-accent-primary bg-surface-subtle transition-all cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={radioId} className="text-sm text-text-primary cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};