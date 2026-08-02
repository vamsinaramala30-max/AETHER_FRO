import React from 'react';
import { Card } from '../ui/card';

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
          <p className="text-xs font-medium text-text-primary">{title}</p>
          <p className="text-[10px] text-text-tertiary">{type}</p>
        </div>
      </div>
      <span className="text-[10px] text-text-tertiary">{timestamp}</span>
    </Card>
  );
};
