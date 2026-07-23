import React from 'react';

interface MemoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const MemoryFilters: React.FC<MemoryFiltersProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = ['all', 'semantic', 'episodic', 'procedural'];

  return (
    <div className="flex items-center space-x-1.5 pb-2 overflow-x-auto scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => { onSelectCategory(cat); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer transition-colors whitespace-nowrap ${
            selectedCategory === cat
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};