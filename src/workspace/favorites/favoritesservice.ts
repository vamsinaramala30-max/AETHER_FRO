import { favoritesApi } from '@/api/favorites.api';

export interface FavoriteItemData {
  id: string;
  title: string;
  category: 'project' | 'file' | 'model';
  starredAt: string;
  resourceId?: string;
}

export const favoritesService = {
  async getFavorites(): Promise<FavoriteItemData[]> {
    const res = await favoritesApi.getAll();
    const items = res.data || [];
    return items.map((i) => ({
      id: i.id,
      title: i.title,
      category: (i.resourceType || 'project') as FavoriteItemData['category'],
      starredAt: i.createdAt,
      resourceId: i.resourceId,
    }));
  },

  async addFavorite(item: Omit<FavoriteItemData, 'id' | 'starredAt'>): Promise<FavoriteItemData> {
    const res = await favoritesApi.add({
      title: item.title,
      resourceType: item.category,
      resourceId: item.resourceId || `res-${Date.now()}`,
    });
    const created = res.data;
    return {
      id: created.id,
      title: created.title,
      category: (created.resourceType || item.category) as FavoriteItemData['category'],
      starredAt: created.createdAt,
      resourceId: created.resourceId,
    };
  },

  async removeFavorite(id: string): Promise<boolean> {
    const res = await favoritesApi.remove(id);
    return res.success;
  },
};
