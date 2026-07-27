import React from 'react';
import { Integration } from './integrationservice';
import { IntegrationStatus } from './IntegrationStatus';

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
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm transition-all hover:border-slate-700/50">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {integration.category}
          </span>
          <IntegrationStatus status={integration.status} />
        </div>

        <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-200">
          {integration.name}
        </h3>

        <div className="mt-3 space-y-1">
          <p className="font-mono text-[11px] text-slate-400">Parameters required:</p>
          <div className="flex flex-wrap gap-1">
            {integration.configSchema.map((field) => (
              <span
                key={field}
                className="rounded border border-slate-900 bg-slate-950 px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4">
        <span className="text-[11px] text-slate-500">
          {integration.lastSyncedAt
            ? `Sync: ${new Date(integration.lastSyncedAt).toLocaleTimeString()}`
            : 'No continuous data exchange'}
        </span>

        {integration.status === 'connected' ? (
          <button
            onClick={() => {
              onStatusChange(integration.id, 'disconnected');
            }}
            className="rounded border border-red-950 px-2.5 py-1 text-xs text-red-400/80 transition-colors hover:bg-red-950/20"
          >
            Disconnect Link
          </button>
        ) : (
          <button
            onClick={() => {
              onStatusChange(integration.id, 'connected');
            }}
            disabled={!isActionable}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              isActionable
                ? 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'cursor-not-allowed border border-slate-950 bg-slate-900 text-slate-600'
            }`}
          >
            Authenticate
          </button>
        )}
      </div>
    </div>
  );
};
