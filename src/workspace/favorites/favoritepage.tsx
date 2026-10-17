import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Star, BookmarkPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { FavoriteCard } from './favoritecard';
import { useFavorites } from './useFavorites';

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, isError, error, removeFavorite, refetch } = useFavorites();

  const handleRemove = (id: string) => {
    void removeFavorite(id);
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Star className="h-7 w-7 shrink-0 fill-amber-500 text-amber-500" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Favorites
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Starred projects, files, notes, automations, and AI resources for quick access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Refresh favorites"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isError && (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{(error as Error)?.message || 'Failed to load favorites. Please try again.'}</span>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && favorites.length === 0 ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Loading favorites...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <BookmarkPlus className="mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No favorites yet</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Star projects, files, notes, automations, or conversations to pin them here for quick access.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <FavoriteCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default FavoritesPage;
