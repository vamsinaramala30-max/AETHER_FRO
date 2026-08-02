import React from 'react';
import { Button } from '../ui/button';

export interface SuccessViewProps {
  title?: string;
  message?: string;
  onContinue?: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  title = 'Operation Complete',
  message = 'Your changes were saved successfully.',
  onContinue,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-status-success/20 bg-status-success/5 p-12 text-center">
      <div className="text-4xl text-status-success">✓</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-xs text-text-secondary">{message}</p>
      {onContinue && (
        <Button size="sm" variant="primary" onClick={onContinue} className="mt-2">
          Continue
        </Button>
      )}
    </div>
  );
};
