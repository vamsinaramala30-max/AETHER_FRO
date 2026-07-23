// frontend/src/workspace/favorites/FavoritesPage.tsx
import React, { useState, useEffect } from 'react';
import { FavoriteCard } from './FavoriteCard';
import { favoritesService, FavoriteItemData } from './favoritesService';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = React.useCallback(async () => {
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to instantiate high-priority pointers mapping state.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (id: string) => {
    try {
      await favoritesService.removeFavorite(id);
      fetchFavorites();
    } catch (err) {
      setError('Could not modify critical index matrix map.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 min-h-screen">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Pinned System Nodes
        </h1>
        <p className="text-sm text-slate-400 mt-1">High-priority operational bookmarks cached permanently within structural memory registers.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500">PARSING STARRED INDICES...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-sm">
          No system nodes pinned inside current user profile cluster.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(item => (
            <FavoriteCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};