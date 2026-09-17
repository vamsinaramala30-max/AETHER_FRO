import React, { useEffect, useState } from 'react';
import { ConnectedAccountCard } from './connectedaccountcard';
import { connectedAccountsService, ConnectedAccount } from './connectedaccountservice';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Link2, AlertCircle } from 'lucide-react';

export const ConnectedAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    connectedAccountsService
      .getConnectedAccounts()
      .then((data: ConnectedAccount[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAccounts(data);
        } else {
          setAccounts([
            {
              provider: 'google',
              name: 'Google',
              connected: false,
            },
          ]);
        }
      })
      .catch((err: any) => {
        setError(err?.message || 'Failed to load connected accounts.');
        setAccounts([
          {
            provider: 'google',
            name: 'Google',
            connected: false,
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = (provider: string) => {
    if (provider === 'google') {
      connectedAccountsService.connectGoogle();
    }
  };

  const handleDisconnect = async (provider: string) => {
    await connectedAccountsService.disconnectAccount(provider);
    loadData();
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <Link2 className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Connected Accounts & Single Sign-On
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage external identities, Google OAuth, and single sign-on authentication
              connections.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
            <span>Loading connected account states...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc) => (
              <ConnectedAccountCard
                key={acc.provider}
                account={acc}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ConnectedAccountsPage;
