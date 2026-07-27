import React from 'react';
import { Spinner } from '../ui/spinner';

export interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading AETHER platform...',
}) => {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center space-y-4">
      <Spinner size="lg" />
      <p className="text-text-tertiary text-xs font-medium">{message}</p>
    </div>
  );
};
