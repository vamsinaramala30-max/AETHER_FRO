import React from 'react';
import { FavoriteItemData } from './favoritesservice';
import { Star, Trash2 } from 'lucide-react';

interface FavoriteCardProps {
  item: FavoriteItemData;
  onRemove: (id: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
          <span className="mt-0.5 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
            {item.category}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="group rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-400 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        title="Unstar item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
