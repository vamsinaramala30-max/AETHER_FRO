import React from 'react';
import { Button } from '../ui/button';

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
    <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-status-error/20 bg-status-error/5 p-12 text-center">
      <div className="text-4xl text-status-error">⚠️</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-xs font-medium text-status-error">{error}</p>
      {onRetry && (
        <Button size="sm" variant="danger" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
};
