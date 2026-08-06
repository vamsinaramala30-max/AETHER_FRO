import React, { useState, useEffect } from 'react';
import { Star, BookmarkPlus, AlertCircle } from 'lucide-react';
import { FavoriteCard } from './favoritecard';
import { favoritesService, FavoriteItemData } from './favoritesservice';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch {
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = (id: string) => {
    // Optimistic update
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    void (async () => {
      try {
        await favoritesService.removeFavorite(id);
      } catch {
        // Reload on failure to restore correct state
        await fetchFavorites();
      }
    })();
  };

  return (
    <div className="w-full space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 shadow-lg shadow-amber-500/20">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Favorites
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Starred projects, files, and resources for quick access.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Loading favorites...
          </span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <BookmarkPlus className="mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No favorites yet
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Star projects, files, or resources to pin them here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <FavoriteCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};
