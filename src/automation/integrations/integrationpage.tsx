import React, { useEffect, useState } from 'react';
import { integrationsService, Integration } from './integrationservice';
import { IntegrationCard } from './integrationcard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Cpu } from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationsService.getIntegrations();
      setIntegrations(data);
      setError(null);
    } catch {
      setError('Communication loss with external infrastructure configuration matrix.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleStatusChange = async (id: string, target: 'connected' | 'disconnected') => {
    try {
      const updated = await integrationsService.updateIntegrationStatus(id, target);
      setIntegrations((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch {
      setError('Gateway interface status update transactional drop.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <PageWrapper>
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Cpu className="h-7 w-7 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Integration Network
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Bridge secure data links to third-party endpoints, deployment engines, and team
                platforms.
              </p>
            </div>
          </div>
        </div>

        {integrations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No integration pipelines detected.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
