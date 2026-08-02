import React from 'react';

interface SearchFiltersProps {
  typeFilter: 'all' | 'note' | 'document';
  setTypeFilter: (type: 'all' | 'note' | 'document') => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ typeFilter, setTypeFilter }) => {
  return (
    <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
      {(['all', 'note', 'document'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTypeFilter(t)}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
            typeFilter === t
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {t === 'all' ? 'All Items' : `${t}s`}
        </button>
      ))}
    </div>
  );
};
