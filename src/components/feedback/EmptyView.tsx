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
  onAction,
}) => {
  return (
    <div className="border-border-subtle bg-surface-subtle flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed p-12 text-center">
      <div className="text-4xl">🍃</div>
      <h3 className="text-text-primary text-base font-semibold">{title}</h3>
      <p className="text-text-tertiary max-w-sm text-xs">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
