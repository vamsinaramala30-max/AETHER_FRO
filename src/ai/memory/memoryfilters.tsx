import React from 'react';

interface MemoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const MemoryFilters: React.FC<MemoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = ['all', 'semantic', 'episodic', 'procedural'];

  return (
    <div className="scrollbar-none flex items-center space-x-1.5 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            onSelectCategory(cat);
          }}
          className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
            selectedCategory === cat
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
