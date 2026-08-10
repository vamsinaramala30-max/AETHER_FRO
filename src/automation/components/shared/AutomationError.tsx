import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const AutomationError: React.FC<Props> = ({
  message = 'An unexpected error occurred while loading automation data.',
  onRetry,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3.5 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/40"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
};
