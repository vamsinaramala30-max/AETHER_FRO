// frontend/src/settings/connected-accounts/ConnectedAccountCard.tsx
import React, { useState } from 'react';
import { ConnectedAccount } from './connectedAccountsService';

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onDisconnect: (provider: string) => Promise<void>;
}

export const ConnectedAccountCard: React.FC<ConnectedAccountCardProps> = ({ account, onDisconnect }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onDisconnect(account.provider);
    } catch (err) {
      // Handled via upstream boundaries cleanly
    } finally {
      setIsProcessing(false);
    }
  };

  const isConnected = !!account.identityName;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm max-w-2xl">
      <div>
        <span className="font-semibold text-white capitalize">{account.provider}</span>
        <p className="text-xs text-slate-400 mt-0.5">
          {isConnected ? `Authorized identity bound: ${account.identityName}` : 'No explicit credential linkage initialized.'}
        </p>
      </div>
      {isConnected ? (
        <button type="button" onClick={handleAction} disabled={isProcessing} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 rounded border border-slate-700 hover:border-rose-900 text-xs font-medium transition disabled:opacity-50">
          {isProcessing ? 'Severing...' : 'Disconnect'}
        </button>
      ) : (
        <a href={`/api/auth/connect/${account.provider}`} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition shadow-sm">
          Link Channel
        </a>
      )}
    </div>
  );
};