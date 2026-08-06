import React, { useEffect, useState } from 'react';
import { ConnectedAccountCard } from './connectedaccountcard';
import { connectedAccountsService, ConnectedAccount } from './connectedaccountservice';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Link2 } from 'lucide-react';

const DEFAULT_PROVIDERS: ConnectedAccount[] = [
  { provider: 'github', identityName: '' },
  { provider: 'google', identityName: '' },
  { provider: 'gitlab', identityName: '' },
];

export const ConnectedAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    connectedAccountsService
      .getConnectedAccounts()
      .then((data: ConnectedAccount[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAccounts(data);
        } else {
          setAccounts(DEFAULT_PROVIDERS);
        }
      })
      .catch(() => {
        setAccounts(DEFAULT_PROVIDERS);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (provider: string) => {
    // Simulate connection or redirect to auth provider
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.provider === provider ? { ...acc, identityName: `user@${provider}.com` } : acc,
      ),
    );
  };

  const handleDisconnect = async (provider: string) => {
    try {
      await connectedAccountsService.disconnectAccount(provider);
    } catch {
      // Ignore disconnect error for unlinked items
    }
    setAccounts((prev) =>
      prev.map((acc) => (acc.provider === provider ? { ...acc, identityName: '' } : acc)),
    );
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Link2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Connected Accounts & SSO Providers
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage single sign-on connections, OAuth integrations, and external repositories.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
            <span>Loading connected accounts...</span>
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
