// frontend/src/knowledge/search/SearchResults.tsx
import React from 'react';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      {results.map((res) => (
        <div
          key={res.id}
          className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 transition-all hover:border-neutral-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  res.type === 'note'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                    : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                }`}
              >
                {res.type}
              </span>
              <h3 className="text-sm font-medium text-white">{res.title}</h3>
            </div>
            <span className="font-mono text-[10px] text-neutral-600">
              Weight match: {res.score.toFixed(2)}
            </span>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-neutral-400">{res.snippet}</p>
          <div className="pt-1 font-mono text-[10px] text-neutral-500">
            Indexed: {new Date(res.date).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
