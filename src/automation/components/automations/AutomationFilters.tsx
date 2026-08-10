import React from 'react';
import { AutomationStatus } from '../../automation-types';

interface Props {
  statusFilter: 'ALL' | AutomationStatus;
  onStatusChange: (status: 'ALL' | AutomationStatus) => void;
}

export const AutomationFilters: React.FC<Props> = ({ statusFilter, onStatusChange }) => {
  const filterOptions: Array<{ id: 'ALL' | AutomationStatus; label: string }> = [
    { id: 'ALL', label: 'All Automations' },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'draft', label: 'Draft' },
  ];

  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
      {filterOptions.map((opt) => {
        const isActive = statusFilter === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onStatusChange(opt.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
