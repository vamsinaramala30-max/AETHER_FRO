import React, { useEffect, useState } from 'react';
import { ConnectedAccountCard } from './connectedaccountcard';
import { connectedAccountsService, ConnectedAccount } from './connectedaccountservice';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Link2 } from 'lucide-react';

export const ConnectedAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    connectedAccountsService
      .getConnectedAccounts()
      .then((data: ConnectedAccount[]) => {
        setAccounts(data);
      })
      .catch(() => {
        setAccounts([
          { provider: 'github', identityName: 'vamsi-naramala' },
          { provider: 'google', identityName: 'vamsi@example.com' },
          { provider: 'gitlab', identityName: '' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDisconnect = async (provider: string) => {
    await connectedAccountsService.disconnectAccount(provider);
    loadData();
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
          <div className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Loading connected accounts...
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc) => (
              <ConnectedAccountCard
                key={acc.provider}
                account={acc}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
