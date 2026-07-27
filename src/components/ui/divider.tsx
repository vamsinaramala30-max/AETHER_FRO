import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`bg-border-subtle h-full w-[1px] self-stretch ${className}`} />;
  }

  const hasLabel = typeof label === 'string' && label.trim() !== '';

  return (
    <div className={`relative my-4 flex w-full items-center ${className}`}>
      <div className="border-border-subtle flex-grow border-t" />
      {hasLabel && (
        <span className="text-text-tertiary bg-surface-base px-3 text-xs uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="border-border-subtle flex-grow border-t" />
    </div>
  );
};
