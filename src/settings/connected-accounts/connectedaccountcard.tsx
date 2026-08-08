import React, { useState } from 'react';
import { ConnectedAccount } from './connectedaccountservice';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onConnect: (provider: string) => Promise<void>;
  onDisconnect: (provider: string) => Promise<void>;
}

export const ConnectedAccountCard: React.FC<ConnectedAccountCardProps> = ({
  account,
  onConnect,
  onDisconnect,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  const isConnected =
    typeof account.identityName === 'string' && account.identityName.trim() !== '';

  const handleDisconnect = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatusType('info');
    setStatusMessage(`Disconnecting from ${account.provider}...`);

    try {
      await onDisconnect(account.provider);
      setStatusType('success');
      setStatusMessage(`${account.provider} account disconnected.`);
    } catch {
      setStatusType('error');
      setStatusMessage(`Failed to disconnect ${account.provider}.`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleConnect = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatusType('info');
    setStatusMessage(`Redirecting to ${account.provider}... Authorization started.`);

    try {
      await onConnect(account.provider);
      setStatusType('success');
      setStatusMessage(`Successfully connected to ${account.provider}.`);
    } catch {
      setStatusType('error');
      setStatusMessage(`Failed to connect ${account.provider}.`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div>
          <span className="text-base font-bold capitalize text-slate-900 dark:text-white">
            {account.provider}
          </span>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {isConnected ? `Connected: ${account.identityName}` : 'No credential link active.'}
          </p>
        </div>
        {isConnected ? (
          <button
            type="button"
            onClick={() => void handleDisconnect()}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            {isProcessing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isProcessing ? 'Disconnecting...' : 'Disconnect'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleConnect()}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {isProcessing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isProcessing ? 'Connecting...' : 'Connect'}</span>
          </button>
        )}
      </div>

      {/* User-friendly Status Notice */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium ${
            statusType === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-300'
              : statusType === 'error'
                ? 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-950/20 dark:text-rose-300'
                : 'border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-950/20 dark:text-indigo-300'
          }`}
        >
          {statusType === 'success' ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : statusType === 'error' ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
