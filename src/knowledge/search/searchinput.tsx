// frontend/src/knowledge/search/SearchInput.tsx
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Query files, markdown nodes, entities, and relationships..."
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        className="w-full bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm shadow-xl font-mono"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};