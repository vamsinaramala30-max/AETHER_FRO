import React from 'react';
import { SystemPrompt } from './promptService';

interface PromptCardProps {
  prompt: SystemPrompt;
  onEdit: (p: SystemPrompt) => void;
  onSelect: (template: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onSelect }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
            {prompt.category}
          </span>
          <span className="text-[10px] font-mono text-slate-400">~{prompt.tokensEstimate} tkns</span>
        </div>
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200">{prompt.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {prompt.description}
        </p>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t border-slate-50 dark:border-slate-800/60">
        <button
          onClick={() => { onSelect(prompt.template); }}
          className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer text-center"
        >
          Inject Template
        </button>
        <button
          onClick={() => { onEdit(prompt); }}
          className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Modify
        </button>
      </div>
    </div>
  );
};