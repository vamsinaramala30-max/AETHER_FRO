import React from 'react';
import { SystemPrompt } from './promptService';

interface PromptCardProps {
  prompt: SystemPrompt;
  onEdit: (p: SystemPrompt) => void;
  onSelect: (template: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onSelect }) => {
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {prompt.category}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            ~{prompt.tokensEstimate} tkns
          </span>
        </div>
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200">{prompt.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {prompt.description}
        </p>
      </div>

      <div className="flex items-center space-x-2 border-t border-slate-50 pt-2 dark:border-slate-800/60">
        <button
          onClick={() => {
            onSelect(prompt.template);
          }}
          className="flex-1 cursor-pointer rounded-lg bg-slate-900 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Inject Template
        </button>
        <button
          onClick={() => {
            onEdit(prompt);
          }}
          className="cursor-pointer rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Modify
        </button>
      </div>
    </div>
  );
};
