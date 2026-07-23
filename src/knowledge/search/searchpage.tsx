// frontend/src/knowledge/search/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types';
import { searchService } from './searchService';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'note' | 'document'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const executeSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const allRes = await searchService.queryAll(query);
        const filtered = allRes.filter(r => typeFilter === 'all' || r.type === typeFilter);
        setResults(filtered);
      } catch {
        console.error('Error executing query across database clusters');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(executeSearch, 300);
    return () => { clearTimeout(delayDebounce); };
  }, [query, typeFilter]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Global Query Engine</h1>
        <p className="text-xs text-neutral-400 mt-1">Deep search traversal over schema elements, indexes, and document notes.</p>
      </div>

      <SearchInput value={query} onChange={setQuery} onClear={() => { setQuery(''); }} />
      
      {query.trim() && <SearchFilters typeFilter={typeFilter} setTypeFilter={setTypeFilter} />}

      {loading ? (
        <div className="text-center py-12 font-mono text-xs text-neutral-500 animate-pulse">Running cluster index scans...</div>
      ) : query.trim() && results.length === 0 ? (
        <div className="text-center py-12 border border-neutral-800 border-dashed rounded-xl bg-neutral-900/10">
          <p className="text-neutral-500 text-xs font-mono">No relevant matching structural items found.</p>
        </div>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
};