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
    return <div className={`h-full w-[1px] self-stretch bg-border-subtle ${className}`} />;
  }

  const hasLabel = typeof label === 'string' && label.trim() !== '';

  return (
    <div className={`relative my-4 flex w-full items-center ${className}`}>
      <div className="flex-grow border-t border-border-subtle" />
      {hasLabel && (
        <span className="bg-surface-base px-3 text-xs uppercase tracking-wider text-text-tertiary">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-border-subtle" />
    </div>
  );
};
