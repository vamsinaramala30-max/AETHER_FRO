// frontend/src/automation/integrations/IntegrationsPage.tsx
import React, { useEffect, useState } from 'react';
import { integrationsService, Integration } from './integrationservice';
import { IntegrationCard } from './integrationcard';

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
      setIntegrations(prev => prev.map(i => i.id === id ? updated : i));
    } catch {
      setError('Gateway interface status update transactional drop.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-xs bg-red-950/40 text-red-400 border border-red-900/40 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">Integration Network</h1>
        <p className="text-xs text-slate-400">Bridge secure data links to third-party endpoints, deployment engines, and team platforms.</p>
      </div>

      {integrations.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
          <p className="text-sm text-slate-500">No interface pipelines detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
  );
};