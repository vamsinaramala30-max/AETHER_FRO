import { favoritesApi } from '@/api/favorites.api';

export interface FavoriteItemData {
  id: string;
  title: string;
  category: 'project' | 'file' | 'model' | 'note' | 'conversation' | 'automation' | string;
  starredAt: string;
  resourceId?: string;
  metadata?: Record<string, unknown> | null;
}

export const favoritesService = {
  async getFavorites(): Promise<FavoriteItemData[]> {
    const res = await favoritesApi.getAll();
    const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    return items.map((i) => ({
      id: i.id,
      title: i.title,
      category: i.resourceType || 'project',
      starredAt: i.createdAt,
      resourceId: i.resourceId,
      metadata: i.metadata,
    }));
  },

  async addFavorite(item: Omit<FavoriteItemData, 'id' | 'starredAt'>): Promise<FavoriteItemData> {
    const res = await favoritesApi.add({
      title: item.title,
      resourceType: item.category,
      resourceId: item.resourceId || `res-${Date.now()}`,
      metadata: item.metadata || undefined,
    });
    const created = res.data;
    return {
      id: created.id,
      title: created.title,
      category: created.resourceType || item.category,
      starredAt: created.createdAt,
      resourceId: created.resourceId,
      metadata: created.metadata,
    };
  },

  async removeFavorite(id: string): Promise<boolean> {
    const res = await favoritesApi.remove(id);
    return res.success;
  },

  async removeByResource(resourceType: string, resourceId: string): Promise<boolean> {
    const res = await favoritesApi.removeByResource(resourceType, resourceId);
    return res.success;
  },
};
