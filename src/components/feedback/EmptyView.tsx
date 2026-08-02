import React from 'react';
import { Button } from '../ui/button';

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
    <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-border-subtle bg-surface-subtle p-12 text-center">
      <div className="text-4xl">🍃</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="max-w-sm text-xs text-text-tertiary">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
