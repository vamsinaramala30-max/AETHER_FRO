import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = ''
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] bg-border-subtle h-full self-stretch ${className}`} />;
  }

  return (
    <div className={`relative flex items-center w-full my-4 ${className}`}>
      <div className="flex-grow border-t border-border-subtle" />
      {label && (
        <span className="px-3 text-xs uppercase tracking-wider text-text-tertiary bg-surface-base">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-border-subtle" />
    </div>
  );
};