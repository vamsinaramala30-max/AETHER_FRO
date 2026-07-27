// frontend/src/settings/connected-accounts/ConnectedAccountCard.tsx
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
        // Handled via upstream boundaries cleanly
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  const isConnected =
    typeof account.identityName === 'string' && account.identityName.trim() !== '';

  return (
    <div className="flex max-w-2xl items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
      <div>
        <span className="font-semibold capitalize text-white">{account.provider}</span>
        <p className="mt-0.5 text-xs text-slate-400">
          {isConnected
            ? `Authorized identity bound: ${account.identityName}`
            : 'No explicit credential linkage initialized.'}
        </p>
      </div>
      {isConnected ? (
        <button
          type="button"
          onClick={handleAction}
          disabled={isProcessing}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-900 hover:bg-rose-950 hover:text-rose-400 disabled:opacity-50"
        >
          {isProcessing ? 'Severing...' : 'Disconnect'}
        </button>
      ) : (
        <a
          href={`/api/auth/connect/${account.provider}`}
          className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          Link Channel
        </a>
      )}
    </div>
  );
};
