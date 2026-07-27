import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="my-2 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h4 className="font-semibold text-red-800 dark:text-red-200">Execution Error</h4>
          <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{message}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/60 dark:text-red-200 dark:hover:bg-red-800"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="rounded-lg p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
