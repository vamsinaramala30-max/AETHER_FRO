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
        <div className="text-text-secondary flex justify-between text-xs font-medium">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={`bg-surface-hover w-full overflow-hidden rounded-full ${heights[size]}`}>
        <div
          className="from-accent-primary to-accent-secondary h-full rounded-full bg-gradient-to-r transition-all duration-300"
          style={{ width: `${String(clampedValue)}%` }}
        />
      </div>
    </div>
  );
};
