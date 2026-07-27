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
    <div className="bg-status-success/5 border-status-success/20 flex w-full flex-col items-center justify-center space-y-3 rounded-2xl border p-12 text-center">
      <div className="text-status-success text-4xl">✓</div>
      <h3 className="text-text-primary text-base font-semibold">{title}</h3>
      <p className="text-text-secondary text-xs">{message}</p>
      {onContinue && (
        <Button size="sm" variant="primary" onClick={onContinue} className="mt-2">
          Continue
        </Button>
      )}
    </div>
  );
};
