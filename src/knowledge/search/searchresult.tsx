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
        <div key={res.id} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-all space-y-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                res.type === 'note' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {res.type}
              </span>
              <h3 className="text-white font-medium text-sm">{res.title}</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-600">Weight match: {res.score.toFixed(2)}</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-3xl">{res.snippet}</p>
          <div className="text-[10px] font-mono text-neutral-500 pt-1">
            Indexed: {new Date(res.date).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};