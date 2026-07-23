import React from 'react';
import { Card } from '../ui/Card';

export interface KnowledgeCardProps {
  title: string;
  category: string;
  size: string;
  onClick?: () => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ title, category, size, onClick }) => {
  return (
    <Card hoverable onClick={onClick} className="flex items-start space-x-3">
      <div className="p-2.5 bg-surface-hover rounded-xl text-lg">📄</div>
      <div className="flex-grow min-w-0">
        <p className="text-xs font-semibold text-accent-primary">{category}</p>
        <h4 className="text-sm font-medium text-text-primary truncate">{title}</h4>
        <p className="text-[10px] text-text-tertiary mt-1">{size}</p>
      </div>
    </Card>
  );
};