// frontend/src/automation/integrations/IntegrationStatus.tsx
import React from 'react';

interface IntegrationStatusProps {
  status: 'connected' | 'disconnected' | 'error';
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'connected':
        return { text: 'Operational', style: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' };
      case 'error':
        return { text: 'Fault Detected', style: 'bg-red-950/40 text-red-400 border-red-500/20' };
      default:
        return { text: 'Dormant', style: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const cfg = getBadgeConfig();

  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${cfg.style}`}>
      {cfg.text}
    </span>
  );
};