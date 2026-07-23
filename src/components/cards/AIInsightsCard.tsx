import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface AIInsightCardProps {
  insight: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, actionLabel, onAction }) => {
  return (
    <Card className="bg-gradient-to-br from-accent-primary/10 via-surface-elevated to-surface-elevated border-accent-primary/20 space-y-3">
      <div className="flex items-center space-x-2 text-accent-primary text-xs font-semibold uppercase tracking-wider">
        <span>✨</span>
        <span>AETHER Insight</span>
      </div>
      <p className="text-xs text-text-primary leading-relaxed">{insight}</p>
      {actionLabel && (
        <Button size="sm" variant="glow" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};