// frontend/src/workspace/favorites/favoritesService.ts

export interface FavoriteItemData {
  id: string;
  title: string;
  category: 'project' | 'file' | 'model';
  starredAt: string;
}

const STORAGE_KEY = 'aether_workspace_favorites';

const getLocalFavorites = (): FavoriteItemData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults: FavoriteItemData[] = [
      { id: 'fav1', title: 'AETHER Frontend Runtime core Engine', category: 'project', starredAt: new Date().toISOString() },
      { id: 'fav2', title: 'neural_vector_weights_v2.model', category: 'model', starredAt: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
};

export const favoritesService = {
  async getFavorites(): Promise<FavoriteItemData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalFavorites());
      }, 200);
    });
  },

  async removeFavorite(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getLocalFavorites();
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        resolve(true);
      }, 150);
    });
  }
};