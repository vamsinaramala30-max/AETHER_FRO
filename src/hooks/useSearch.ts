import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useSearch = <T>(items: T[], keyExtractor: (item: T) => string, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedTerm.trim()) return items;
    const term = debouncedTerm.toLowerCase();
    return items.filter((item) => keyExtractor(item).toLowerCase().includes(term));
  }, [items, keyExtractor, debouncedTerm]);

  return { searchTerm, setSearchTerm, filteredItems };
};