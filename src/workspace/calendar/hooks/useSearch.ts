import { useFilterStore } from '../store/filterStore';

export const useSearch = () => {
  const { filters, setFilter, resetFilters } = useFilterStore();

  const setSearchQuery = (query: string) => {
    setFilter('query', query);
  };

  return {
    searchQuery: typeof filters.query === 'string' ? filters.query : '',
    setSearchQuery,
    resetFilters,
  };
};
