import React from 'react';
import { Card } from '../ui/card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
}) => {
  return (
    <Card hoverable className="flex items-center justify-between">
      <div>
        <p className="text-text-tertiary text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h2 className="text-text-primary mt-1 text-2xl font-bold">{value}</h2>
        {change && (
          <p
            className={`mt-1.5 text-xs font-medium ${isPositive ? 'text-status-success' : 'text-status-error'}`}
          >
            {isPositive ? '↑' : '↓'} {change} vs last cycle
          </p>
        )}
      </div>
      {icon && (
        <div className="bg-accent-primary/10 text-accent-primary rounded-xl p-3 text-xl">
          {icon}
        </div>
      )}
    </Card>
  );
};
