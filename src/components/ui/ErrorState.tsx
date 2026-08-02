import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'error' | 'offline' | 'permission';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  type = 'error',
  className = '',
}) => {
  const config = {
    error: {
      icon: AlertTriangle,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'An unexpected error occurred. Please try again.',
      iconClass: 'text-red-400',
      bgClass: 'bg-red-500/10 border-red-500/20',
    },
    offline: {
      icon: WifiOff,
      defaultTitle: 'No connection',
      defaultMessage: 'Check your internet connection and retry.',
      iconClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10 border-amber-500/20',
    },
    permission: {
      icon: AlertTriangle,
      defaultTitle: 'Access denied',
      defaultMessage: "You don't have permission to view this content.",
      iconClass: 'text-orange-400',
      bgClass: 'bg-orange-500/10 border-orange-500/20',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${config.bgClass}`}
      >
        <Icon className={`h-7 w-7 ${config.iconClass}`} />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-200">{title ?? config.defaultTitle}</h3>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">
        {message ?? config.defaultMessage}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
