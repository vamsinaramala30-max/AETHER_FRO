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
      <div className="rounded-xl bg-surface-hover p-2.5 text-lg">📄</div>
      <div className="min-w-0 flex-grow">
        <p className="text-xs font-semibold text-accent-primary">{category}</p>
        <h4 className="truncate text-sm font-medium text-text-primary">{title}</h4>
        <p className="mt-1 text-[10px] text-text-tertiary">{size}</p>
      </div>
    </Card>
  );
};
