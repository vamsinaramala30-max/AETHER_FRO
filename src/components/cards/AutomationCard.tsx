import React from 'react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';

export interface AutomationCardProps {
  title: string;
  trigger: string;
  enabled: boolean;
  onToggle: (state: boolean) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  title,
  trigger,
  enabled,
  onToggle,
}) => {
  return (
    <Card className="flex items-center justify-between">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        <p className="text-xs text-text-tertiary">
          Trigger: <span className="font-medium text-text-secondary">{trigger}</span>
        </p>
      </div>
      <Switch checked={enabled} onChange={onToggle} />
    </Card>
  );
};
