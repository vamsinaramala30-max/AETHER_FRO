import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService, FavoriteItemData } from './favoritesservice';

export const FAVORITES_QUERY_KEY = ['favorites'] as const;

export function useFavorites() {
  const queryClient = useQueryClient();

  const query = useQuery<FavoriteItemData[]>({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => favoritesService.getFavorites(),
    staleTime: 30000,
  });

  const addMutation = useMutation({
    mutationFn: (item: Omit<FavoriteItemData, 'id' | 'starredAt'>) =>
      favoritesService.addFavorite(item),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => favoritesService.removeFavorite(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeByResourceMutation = useMutation({
    mutationFn: ({ resourceType, resourceId }: { resourceType: string; resourceId: string }) =>
      favoritesService.removeByResource(resourceType, resourceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const isFavorite = (resourceType: string, resourceId: string): boolean => {
    if (!query.data || !Array.isArray(query.data)) return false;
    return query.data.some(
      (f) =>
        f.category?.toLowerCase() === resourceType.toLowerCase() &&
        f.resourceId === resourceId,
    );
  };

  const getFavoriteId = (resourceType: string, resourceId: string): string | undefined => {
    if (!query.data || !Array.isArray(query.data)) return undefined;
    return query.data.find(
      (f) =>
        f.category?.toLowerCase() === resourceType.toLowerCase() &&
        f.resourceId === resourceId,
    )?.id;
  };

  const toggleFavorite = async (item: {
    title: string;
    category: string;
    resourceId: string;
    metadata?: Record<string, unknown>;
  }) => {
    const existingId = getFavoriteId(item.category, item.resourceId);
    if (existingId) {
      await removeMutation.mutateAsync(existingId);
    } else {
      await addMutation.mutateAsync({
        title: item.title,
        category: item.category,
        resourceId: item.resourceId,
        metadata: item.metadata,
      });
    }
  };

  return {
    favorites: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFavorite,
    getFavoriteId,
    toggleFavorite,
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
    removeByResource: removeByResourceMutation.mutateAsync,
  };
}
