import React from 'react';
import { Spinner } from '../ui/Spinner';

export interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading AETHER platform...' }) => {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
      <Spinner size="lg" />
      <p className="text-xs text-text-tertiary font-medium">{message}</p>
    </div>
  );
};