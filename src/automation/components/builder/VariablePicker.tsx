import React from 'react';
import { Tag } from 'lucide-react';

interface Props {
  onSelectVariable: (variableKey: string) => void;
}

export const VariablePicker: React.FC<Props> = ({ onSelectVariable }) => {
  const variables = [
    { key: '{{trigger.title}}', label: 'Trigger Title' },
    { key: '{{trigger.user}}', label: 'Triggering User' },
    { key: '{{ai.response}}', label: 'AI Output Summary' },
    { key: '{{tasks.overdueCount}}', label: 'Overdue Task Count' },
    { key: '{{calendar.nextMeeting}}', label: 'Next Event Title' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Tag className="h-3.5 w-3.5 text-amber-500" />
        Insert Dynamic Variable
      </div>
      <div className="flex flex-wrap gap-1.5">
        {variables.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelectVariable(v.key)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:border-amber-500 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
};
