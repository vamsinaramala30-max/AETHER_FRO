// frontend/src/knowledge/search/SearchFilters.tsx
import React from 'react';

interface SearchFiltersProps {
  typeFilter: 'all' | 'note' | 'document';
  setTypeFilter: (type: 'all' | 'note' | 'document') => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ typeFilter, setTypeFilter }) => {
  return (
    <div className="flex gap-2 border-b border-neutral-900 pb-2">
      {(['all', 'note', 'document'] as const).map((t) => (
        <button
          key={t}
          onClick={() => {
            setTypeFilter(t);
          }}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
            typeFilter === t
              ? 'bg-amber-500 font-medium text-neutral-950'
              : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          {t === 'all' ? 'All Objects' : `${t}s`}
        </button>
      ))}
    </div>
  );
};
