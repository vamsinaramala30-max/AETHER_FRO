import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export interface AIInsightCardProps {
  insight: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, actionLabel, onAction }) => {
  return (
    <Card className="from-accent-primary/10 via-surface-elevated to-surface-elevated border-accent-primary/20 space-y-3 bg-gradient-to-br">
      <div className="text-accent-primary flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
        <span>✨</span>
        <span>AETHER Insight</span>
      </div>
      <p className="text-text-primary text-xs leading-relaxed">{insight}</p>
      {actionLabel && (
        <Button size="sm" variant="glow" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
