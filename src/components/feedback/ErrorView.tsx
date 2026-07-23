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
  onRetry
}) => {
  return (
    <div className="w-full p-12 text-center flex flex-col items-center justify-center space-y-3 bg-status-error/5 border border-status-error/20 rounded-2xl">
      <div className="text-4xl text-status-error">⚠️</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-xs text-status-error font-medium">{error}</p>
      {onRetry && (
        <Button size="sm" variant="danger" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
};