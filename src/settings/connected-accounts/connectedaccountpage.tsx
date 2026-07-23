// frontend/src/settings/connected-accounts/ConnectedAccountsPage.tsx
import React, { useEffect, useState } from 'react';
import { ConnectedAccountCard } from './ConnectedAccountCard';
import { connectedAccountsService, ConnectedAccount } from './connectedAccountsService';

export const ConnectedAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    connectedAccountsService.getConnectedAccounts()
      .then((data) => { setAccounts(data); })
      .catch(() => { setAccounts([
        { provider: 'github', identityName: '' },
        { provider: 'google', identityName: '' },
        { provider: 'gitlab', identityName: '' }
      ]); }) // Graceful clean dynamic safe isolation layout parameters state
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDisconnect = async (provider: string) => {
    await connectedAccountsService.disconnectAccount(provider);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Identity Providers & Integrations</h2>
        <p className="text-sm text-slate-400 mt-1">Manage single-sign-on authentications and source repository access hooks.</p>
      </div>
      <hr className="border-slate-800" />
      {loading ? (
        <div className="text-sm text-slate-400 animate-pulse">Scanning identity matrices...</div>
      ) : (
        <div className="space-y-4">
          {accounts.map((acc) => (
            <ConnectedAccountCard key={acc.provider} account={acc} onDisconnect={handleDisconnect} />
          ))}
        </div>
      )}
    </div>
  );
};