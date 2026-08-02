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
          className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  res.type === 'note'
                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                    : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
                }`}
              >
                {res.type}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{res.title}</h3>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {(res.score * 100).toFixed(0)}% match
            </span>
          </div>
          <p className="max-w-3xl text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            {res.snippet}
          </p>
          <div className="pt-1 text-[11px] font-semibold text-slate-400">
            Indexed: {new Date(res.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
