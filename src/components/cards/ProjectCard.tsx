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
        <h3 className="text-text-primary truncate text-base font-semibold">{title}</h3>
        <Badge
          variant={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'neutral'}
        >
          {status}
        </Badge>
      </div>
      <p className="text-text-secondary line-clamp-2 text-xs">{description}</p>
      <div className="border-border-subtle text-text-tertiary flex items-center justify-between border-t pt-2 text-[10px]">
        <span>Updated {updatedAt}</span>
        <span>→</span>
      </div>
    </Card>
  );
};
