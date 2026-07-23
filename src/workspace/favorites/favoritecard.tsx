// frontend/src/workspace/favorites/FavoriteCard.tsx
import React from 'react';
import { FavoriteItemData } from './favoritesService';

interface FavoriteCardProps {
  item: FavoriteItemData;
  onRemove: (id: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, onRemove }) => {
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="text-amber-400">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
          <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 mt-1 inline-block">
            {item.category}
          </span>
        </div>
      </div>

      <button
        onClick={() => { onRemove(item.id); }}
        className="p-1.5 rounded-lg border border-slate-800 hover:border-red-900 text-slate-400 hover:text-red-400 bg-slate-950/40 hover:bg-red-950/20 transition-all group"
        title="Unstar component"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-14v4M1 7h22" />
        </svg>
      </button>
    </div>
  );
};