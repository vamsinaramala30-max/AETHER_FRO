import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types';
import { searchService } from './searchservice';
import { SearchInput } from './searchinput';
import { SearchFilters } from './searchfilter';
import { SearchResults } from './searchresult';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Search } from 'lucide-react';

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
          console.error('Error executing query');
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
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Search className="h-7 w-7 text-purple-600 dark:text-purple-400 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Semantic Search Engine
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Deep search traversal over document vaults, notes, and vector knowledge nodes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SearchInput value={query} onChange={setQuery} onClear={() => setQuery('')} />

        {query.trim() !== '' && (
          <SearchFilters typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
        )}

        {loading ? (
          <div className="animate-pulse py-12 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Running vector index scans...
          </div>
        ) : query.trim() !== '' && results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              No matching knowledge items found.
            </p>
          </div>
        ) : (
          <SearchResults results={results} />
        )}
      </div>
    </PageWrapper>
  );
};
