import React from 'react';
import {
  Inbox,
  Loader2,
  AlertTriangle,
  WifiOff,
  Gauge,
  SearchX,
  ShieldAlert,
  LogOut,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  ArrowRight,
  KeyRound,
  Search,
  Wifi,
} from 'lucide-react';

export interface StateViewProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

// 1. Empty State
export const EmptyState: React.FC<StateViewProps> = ({
  title = 'No Data Available',
  description = 'There are no items found in this section. Start by creating a new workspace item.',
  actionLabel = 'Create New Item',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <Inbox className="mb-4 h-12 w-12 text-indigo-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-400">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    )}
  </div>
);

// 2. Loading State
export const LoadingState: React.FC<{ message?: string; subtext?: string; className?: string }> = ({
  message = 'Loading Data...',
  subtext = 'Fetching real-time updates from AETHER core network...',
  className = '',
}) => (
  <div
    className={`flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <div className="relative mb-6">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
      <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
    </div>
    <h3 className="mb-1 text-base font-medium tracking-wide text-white">{message}</h3>
    <p className="text-xs text-slate-400">{subtext}</p>
  </div>
);

// 3. Error State
export const ErrorState: React.FC<StateViewProps & { errorDetails?: string }> = ({
  title = 'System Error Occurred',
  description = 'An unexpected server exception interrupted your request. Please try re-initiating the operation.',
  errorDetails,
  actionLabel = 'Try Again',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/20 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <AlertTriangle className="mb-4 h-12 w-12 text-red-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-4 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {errorDetails && (
      <div className="mb-6 w-full max-w-md rounded-lg border border-red-900/40 bg-slate-950/80 p-3 text-left">
        <code className="break-all font-mono text-xs text-red-300">{errorDetails}</code>
      </div>
    )}
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <RefreshCw className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// 4. No Internet State
export const NoInternetState: React.FC<StateViewProps> = ({
  title = 'You are Offline',
  description = 'No active internet connection was detected. Please verify your Wi-Fi or network hardware.',
  actionLabel = 'Check Connection',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-950/10 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <WifiOff className="mb-4 h-12 w-12 text-amber-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <Wifi className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// 5. Slow Network State
export const SlowNetworkState: React.FC<StateViewProps> = ({
  title = 'High Latency Detected',
  description = 'Your network connection response time is sluggish. Data may take longer than usual to load.',
  actionLabel = 'Reload Webpage',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <Gauge className="mb-4 h-12 w-12 text-yellow-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <RefreshCw className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// 6. No Search Found State
export const NoSearchFoundState: React.FC<StateViewProps & { searchQuery?: string }> = ({
  title = 'No Matching Results',
  description = "We couldn't find anything matching your query terms. Try refining your keywords or clear filters.",
  searchQuery,
  actionLabel = 'Clear Search Query',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <SearchX className="mb-4 h-12 w-12 text-cyan-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    {searchQuery && (
      <p className="mb-3 rounded-md border border-cyan-800/40 bg-cyan-950/50 px-3 py-1 font-mono text-xs text-cyan-300">
        "{searchQuery}"
      </p>
    )}
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-400">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
      >
        <Search className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// 7. Permission Denied State
export const PermissionDeniedState: React.FC<StateViewProps> = ({
  title = 'Access Forbidden',
  description = 'You do not have administrative privileges to access this resource. Please request authorization from your administrator.',
  actionLabel = 'Request Access',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-950/10 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <ShieldAlert className="mb-4 h-12 w-12 text-purple-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <KeyRound className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// 8. Session Expired State
export const SessionExpiredState: React.FC<StateViewProps> = ({
  title = 'Session Timed Out',
  description = 'Your secure authentication session has expired due to inactivity. Please log back in to resume.',
  actionLabel = 'Log In Again',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-950/10 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <LogOut className="mb-4 h-12 w-12 text-orange-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    )}
  </div>
);

// 9. Form Validation State
export const FormValidationState: React.FC<{
  errors?: string[];
  title?: string;
  description?: string;
  className?: string;
}> = ({
  title = 'Invalid Form Submission',
  description = 'Please correct the highlighted input errors before submitting again.',
  errors = [],
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-start rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 backdrop-blur-sm ${className}`}
  >
    <div className="mb-3 flex items-center gap-3">
      <FileSpreadsheet className="h-6 w-6 text-rose-400 shrink-0" />
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-rose-200">{description}</p>
      </div>
    </div>
    {errors.length > 0 && (
      <ul className="mt-2 w-full list-disc space-y-1.5 pl-4 font-mono text-xs text-rose-300">
        {errors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    )}
  </div>
);

// 10. Success State
export const SuccessState: React.FC<StateViewProps> = ({
  title = 'Operation Completed Successfully',
  description = 'Your changes have been processed and safely persisted in the database.',
  actionLabel = 'Continue',
  onAction,
  className = '',
}) => (
  <div
    className={`flex w-full flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-10 text-center backdrop-blur-sm ${className}`}
  >
    <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    )}
  </div>
);
