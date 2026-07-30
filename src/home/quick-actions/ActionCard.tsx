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
      className="w-full text-left p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group flex flex-col justify-between"
    >
      <div className="flex justify-between items-start w-full">
        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
          {action.label}
        </span>
        {action.shortcutKey && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 rounded">
            {action.shortcutKey}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{action.description}</p>
    </button>
  );
};