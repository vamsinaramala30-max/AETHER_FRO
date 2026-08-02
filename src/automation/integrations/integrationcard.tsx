import React from 'react';
import { Integration } from './integrationservice';
import { IntegrationStatus } from './integrationstatus';

interface IntegrationCardProps {
  integration: Integration;
  onStatusChange: (id: string, targetStatus: 'connected' | 'disconnected') => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onStatusChange,
}) => {
  const isActionable = integration.status !== 'error';

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {integration.category}
          </span>
          <IntegrationStatus status={integration.status} />
        </div>

        <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
          {integration.name}
        </h3>

        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Required Config Keys:
          </p>
          <div className="flex flex-wrap gap-1">
            {integration.configSchema.map((field) => (
              <span
                key={field}
                className="rounded-md border border-slate-200 bg-slate-100/80 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {integration.lastSyncedAt
            ? `Sync: ${new Date(integration.lastSyncedAt).toLocaleTimeString()}`
            : 'No data sync active'}
        </span>

        {integration.status === 'connected' ? (
          <button
            onClick={() => onStatusChange(integration.id, 'disconnected')}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(integration.id, 'connected')}
            disabled={!isActionable}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              isActionable
                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800'
            }`}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
