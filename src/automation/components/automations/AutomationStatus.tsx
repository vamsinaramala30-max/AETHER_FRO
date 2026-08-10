import React from 'react';
import { AutomationStatus } from '../../automation-types';
import { getStatusBadgeStyle } from '../../automation-utils';

interface Props {
  status: AutomationStatus;
}

export const AutomationStatusBadge: React.FC<Props> = ({ status }) => {
  const style = getStatusBadgeStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.color} ${style.border}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'active' ? 'bg-emerald-500' : status === 'paused' ? 'bg-amber-500' : 'bg-slate-400'
        }`}
      />
      {style.label}
    </span>
  );
};
