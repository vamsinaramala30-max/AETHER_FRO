// frontend/src/knowledge/search/SearchFilters.tsx
import React from 'react';

interface SearchFiltersProps {
  typeFilter: 'all' | 'note' | 'document';
  setTypeFilter: (type: 'all' | 'note' | 'document') => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ typeFilter, setTypeFilter }) => {
  return (
    <div className="flex gap-2 pb-2 border-b border-neutral-900">
      {(['all', 'note', 'document'] as const).map((t) => (
        <button
          key={t}
          onClick={() => { setTypeFilter(t); }}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors capitalize font-mono ${
            typeFilter === t
              ? 'bg-amber-500 text-neutral-950 font-medium'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          {t === 'all' ? 'All Objects' : `${t}s`}
        </button>
      ))}
    </div>
  );
};