// frontend/src/workspace/favorites/FavoritesPage.tsx
import React, { useState, useEffect } from 'react';
import { FavoriteCard } from './favoritecard';
import { favoritesService, FavoriteItemData } from './favoritesservice';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = React.useCallback(async () => {
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch {
      setError('Failed to instantiate high-priority pointers mapping state.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = (id: string) => {
    void (async () => {
      try {
        await favoritesService.removeFavorite(id);
        await fetchFavorites();
      } catch {
        setError('Could not modify critical index matrix map.');
      }
    })();
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div>
        <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Pinned System Nodes
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          High-priority operational bookmarks cached permanently within structural memory registers.
        </p>
      </div>

      {typeof error === 'string' && error.trim() !== '' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          <span className="font-mono text-xs text-slate-500">PARSING STARRED INDICES...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-sm text-slate-500">
          No system nodes pinned inside current user profile cluster.
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
