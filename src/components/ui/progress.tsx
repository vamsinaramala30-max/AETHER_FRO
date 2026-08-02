import React from 'react';

export interface ProgressProps {
  value: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-text-secondary">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-surface-hover ${heights[size]}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
          style={{ width: `${String(clampedValue)}%` }}
        />
      </div>
    </div>
  );
};
