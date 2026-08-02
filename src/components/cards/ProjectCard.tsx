import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export interface ProjectCardProps {
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  updatedAt: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  updatedAt,
  onClick,
}) => {
  return (
    <Card hoverable onClick={onClick} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="truncate text-base font-semibold text-text-primary">{title}</h3>
        <Badge
          variant={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'neutral'}
        >
          {status}
        </Badge>
      </div>
      <p className="line-clamp-2 text-xs text-text-secondary">{description}</p>
      <div className="flex items-center justify-between border-t border-border-subtle pt-2 text-[10px] text-text-tertiary">
        <span>Updated {updatedAt}</span>
        <span>→</span>
      </div>
    </Card>
  );
};
