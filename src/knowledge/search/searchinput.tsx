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
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-3 pl-4 pr-10 font-mono text-sm text-white placeholder-neutral-500 shadow-xl transition-colors focus:border-amber-500 focus:outline-none"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs text-neutral-500 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
};
