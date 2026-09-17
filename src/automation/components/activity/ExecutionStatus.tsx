import React from 'react';
import { ExecutionStatus } from '../../automation-types';
import { getExecutionBadgeStyle } from '../../automation-utils';

interface Props {
  status: ExecutionStatus;
}

export const ExecutionStatusBadge: React.FC<Props> = ({ status }) => {
  const style = getExecutionBadgeStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg} ${style.color} ${style.border}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'completed'
            ? 'bg-emerald-500'
            : status === 'failed'
              ? 'bg-rose-500'
              : status === 'running'
                ? 'animate-ping bg-sky-500'
                : 'bg-amber-500'
        }`}
      />
      {style.label}
    </span>
  );
};
