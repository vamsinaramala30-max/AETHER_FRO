import React from 'react';

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const TemplateCategories: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Templates' : cat}
          </button>
        );
      })}
    </div>
  );
};
