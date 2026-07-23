import React from 'react';

interface PromptCategoriesProps {
  active: string;
  onChange: (cat: string) => void;
}

export const PromptCategories: React.FC<PromptCategoriesProps> = ({ active, onChange }) => {
  const options = ['all', 'engineering', 'analysis', 'creative', 'utility'];

  return (
    <div className="flex flex-col space-y-1">
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Domains</h3>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => { onChange(opt); }}
          className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
            active === opt
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};