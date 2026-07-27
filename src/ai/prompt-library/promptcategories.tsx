import React from 'react';

interface PromptCategoriesProps {
  active: string;
  onChange: (cat: string) => void;
}

export const PromptCategories: React.FC<PromptCategoriesProps> = ({ active, onChange }) => {
  const options = ['all', 'engineering', 'analysis', 'creative', 'utility'];

  return (
    <div className="flex flex-col space-y-1">
      <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Domains
      </h3>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            onChange(opt);
          }}
          className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-medium capitalize transition-colors ${
            active === opt
              ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
