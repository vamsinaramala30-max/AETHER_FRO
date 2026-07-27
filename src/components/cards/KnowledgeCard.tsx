import React from 'react';
import { Card } from '../ui/card';

export interface KnowledgeCardProps {
  title: string;
  category: string;
  size: string;
  onClick?: () => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ title, category, size, onClick }) => {
  return (
    <Card hoverable onClick={onClick} className="flex items-start space-x-3">
      <div className="bg-surface-hover rounded-xl p-2.5 text-lg">📄</div>
      <div className="min-w-0 flex-grow">
        <p className="text-accent-primary text-xs font-semibold">{category}</p>
        <h4 className="text-text-primary truncate text-sm font-medium">{title}</h4>
        <p className="text-text-tertiary mt-1 text-[10px]">{size}</p>
      </div>
    </Card>
  );
};
