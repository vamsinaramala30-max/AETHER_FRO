import React from 'react';
import { Button } from '../ui/Button';

export interface EmptyViewProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  title = 'No Data Found',
  description = 'There are no items to display in this workspace.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="w-full p-12 text-center flex flex-col items-center justify-center space-y-3 border border-dashed border-border-subtle rounded-2xl bg-surface-subtle">
      <div className="text-4xl">🍃</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-xs text-text-tertiary max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};