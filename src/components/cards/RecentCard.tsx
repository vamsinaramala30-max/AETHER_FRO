import React from 'react';
import { Card } from '../ui/Card';

export interface RecentCardProps {
  title: string;
  type: string;
  timestamp: string;
}

export const RecentCard: React.FC<RecentCardProps> = ({ title, type, timestamp }) => {
  return (
    <Card hoverable className="flex items-center justify-between p-3.5">
      <div className="flex items-center space-x-3">
        <span className="text-sm">⏱</span>
        <div>
          <p className="text-text-primary text-xs font-medium">{title}</p>
          <p className="text-text-tertiary text-[10px]">{type}</p>
        </div>
      </div>
      <span className="text-text-tertiary text-[10px]">{timestamp}</span>
    </Card>
  );
};
