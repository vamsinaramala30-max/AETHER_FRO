import React, { useState } from 'react';
import { ConnectedAccount } from './connectedaccountservice';
import { CheckCircle, AlertCircle, Loader2, Link2, Unlink } from 'lucide-react';

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onConnect: (provider: string) => void;
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

  const handleDisconnect = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatusType('info');
    setStatusMessage(`Disconnecting ${account.name}...`);

    try {
      await onDisconnect(account.provider);
      setStatusType('success');
      setStatusMessage(`${account.name} account disconnected.`);
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err?.response?.data?.error || err?.message || `Failed to disconnect ${account.name}.`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleConnect = () => {
    onConnect(account.provider);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold">
            {account.provider === 'google' ? 'G' : account.name[0]}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {account.name}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                  account.connected
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {account.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {account.connected
                ? `Linked identity: ${account.accountEmail || 'Authenticated'}`
                : 'Connect your single sign-on provider for quick access.'}
            </p>
          </div>
        </div>

        <div>
          {account.connected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
              <span>{isProcessing ? 'Disconnecting...' : 'Disconnect'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Connect {account.name}</span>
            </button>
          )}
        </div>
      </div>

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
