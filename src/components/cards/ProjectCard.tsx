import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface ProjectCardProps {
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  updatedAt: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, status, updatedAt, onClick }) => {
  return (
    <Card hoverable onClick={onClick} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary truncate">{title}</h3>
        <Badge variant={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'neutral'}>
          {status}
        </Badge>
      </div>
      <p className="text-xs text-text-secondary line-clamp-2">{description}</p>
      <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-[10px] text-text-tertiary">
        <span>Updated {updatedAt}</span>
        <span>→</span>
      </div>
    </Card>
  );
};