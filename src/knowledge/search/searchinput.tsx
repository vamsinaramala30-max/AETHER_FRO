import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search files, markdown nodes, entities, and relationships..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
