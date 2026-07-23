// frontend/src/automation/integrations/IntegrationCard.tsx
import React, { useState } from 'react';
import { Integration } from './integrationservice';
import { IntegrationStatus } from './IntegrationStatus';

interface IntegrationCardProps {
  integration: Integration;
  onStatusChange: (id: string, targetStatus: 'connected' | 'disconnected') => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration, onStatusChange }) => {
  const isActionable = integration.status !== 'error';

  return (
    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-slate-700/50">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {integration.category}
          </span>
          <IntegrationStatus status={integration.status} />
        </div>

        <h3 className="text-base font-semibold text-slate-200 tracking-tight mb-2">
          {integration.name}
        </h3>

        <div className="mt-3 space-y-1">
          <p className="text-[11px] text-slate-400 font-mono">Parameters required:</p>
          <div className="flex flex-wrap gap-1">
            {integration.configSchema.map((field) => (
              <span key={field} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-900 font-mono">
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 mt-5 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          {integration.lastSyncedAt 
            ? `Sync: ${new Date(integration.lastSyncedAt).toLocaleTimeString()}`
            : 'No continuous data exchange'}
        </span>

        {integration.status === 'connected' ? (
          <button
            onClick={() => { onStatusChange(integration.id, 'disconnected'); }}
            className="px-2.5 py-1 text-xs rounded border border-red-950 text-red-400/80 hover:bg-red-950/20 transition-colors"
          >
            Disconnect Link
          </button>
        ) : (
          <button
            onClick={() => { onStatusChange(integration.id, 'connected'); }}
            disabled={!isActionable}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
              isActionable 
                ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200' 
                : 'bg-slate-900 text-slate-600 border border-slate-950 cursor-not-allowed'
            }`}
          >
            Authenticate
          </button>
        )}
      </div>
    </div>
  );
};