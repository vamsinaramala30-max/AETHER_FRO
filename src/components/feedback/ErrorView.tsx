import React from 'react';
import { Button } from '../ui/Button';

export interface ErrorViewProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Something Went Wrong',
  error = 'An unexpected system failure occurred.',
  onRetry,
}) => {
  return (
    <div className="bg-status-error/5 border-status-error/20 flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border p-12 text-center">
      <div className="text-status-error text-4xl">⚠️</div>
      <h3 className="text-text-primary text-base font-semibold">{title}</h3>
      <p className="text-status-error text-xs font-medium">{error}</p>
      {onRetry && (
        <Button size="sm" variant="danger" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
};
