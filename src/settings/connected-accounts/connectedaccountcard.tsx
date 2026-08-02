import React, { useState } from 'react';
import { ConnectedAccount } from './connectedaccountservice';

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onDisconnect: (provider: string) => Promise<void>;
}

export const ConnectedAccountCard: React.FC<ConnectedAccountCardProps> = ({
  account,
  onDisconnect,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    void (async () => {
      try {
        await onDisconnect(account.provider);
      } catch {
        // Handled upstream
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  const isConnected =
    typeof account.identityName === 'string' && account.identityName.trim() !== '';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
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
          onClick={handleAction}
          disabled={isProcessing}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
        >
          {isProcessing ? 'Disconnecting...' : 'Disconnect'}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => alert(`Connect ${account.provider} OAuth flow initialized.`)}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Connect
        </button>
      )}
    </div>
  );
};
