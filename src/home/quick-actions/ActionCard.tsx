import React from 'react';
import { QuickActionItem } from './quickActionsService';

interface ActionCardProps {
  action: QuickActionItem;
  onSelect: (action: QuickActionItem) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(action)}
      className="hover:bg-slate-750 group flex w-full flex-col justify-between rounded-xl border border-slate-700 bg-slate-800 p-3 text-left transition-all hover:border-slate-600"
    >
      <div className="flex w-full items-start justify-between">
        <span className="text-xs font-bold text-white transition-colors group-hover:text-indigo-400">
          {action.label}
        </span>
        {action.shortcutKey && (
          <span className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            {action.shortcutKey}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">{action.description}</p>
    </button>
  );
};
