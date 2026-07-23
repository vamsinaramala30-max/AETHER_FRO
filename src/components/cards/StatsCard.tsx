import React from 'react';
import { Card } from '../ui/Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive = true, icon }) => {
  return (
    <Card hoverable className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{title}</p>
        <h2 className="text-2xl font-bold text-text-primary mt-1">{value}</h2>
        {change && (
          <p className={`text-xs mt-1.5 font-medium ${isPositive ? 'text-status-success' : 'text-status-error'}`}>
            {isPositive ? '↑' : '↓'} {change} vs last cycle
          </p>
        )}
      </div>
      {icon && <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary text-xl">{icon}</div>}
    </Card>
  );
};