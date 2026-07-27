// frontend/src/knowledge/search/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types';
import { searchService } from './searchService';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './searchfilter';
import { SearchResults } from './searchresult';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'note' | 'document'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const executeSearch = () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }
      setLoading(true);
      void (async () => {
        try {
          const allRes = await searchService.queryAll(query);
          const filtered = allRes.filter((r) => typeFilter === 'all' || r.type === typeFilter);
          setResults(filtered);
        } catch {
          console.error('Error executing query across database clusters');
        } finally {
          setLoading(false);
        }
      })();
    };

    const delayDebounce = setTimeout(executeSearch, 300);
    return () => {
      clearTimeout(delayDebounce);
    };
  }, [query, typeFilter]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Global Query Engine</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Deep search traversal over schema elements, indexes, and document notes.
        </p>
      </div>

      <SearchInput
        value={query}
        onChange={setQuery}
        onClear={() => {
          setQuery('');
        }}
      />

      {query.trim() !== '' && (
        <SearchFilters typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
      )}

      {loading ? (
        <div className="animate-pulse py-12 text-center font-mono text-xs text-neutral-500">
          Running cluster index scans...
        </div>
      ) : query.trim() !== '' && results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/10 py-12 text-center">
          <p className="font-mono text-xs text-neutral-500">
            No relevant matching structural items found.
          </p>
        </div>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
};
