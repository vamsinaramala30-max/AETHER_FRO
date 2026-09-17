import React, { useState, useEffect, useRef } from 'react';
import { SearchResult } from '../notes.types';
import { notesService } from '../notesService';
import { Search, X } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const found = await notesService.search(query);
      setResults(found);
      setLoading(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search notes"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--notes-border)] bg-[var(--notes-surface-raised)] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-[var(--notes-border)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--notes-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notebooks, sections, pages, tags..."
            className="flex-1 bg-transparent text-sm text-[var(--notes-text)] outline-none placeholder:text-[var(--notes-muted)]"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="text-[var(--notes-muted)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <p className="px-4 py-6 text-center text-xs text-[var(--notes-muted)]">Searching...</p>
          ) : query.trim() && results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-semibold text-[var(--notes-text)]">No matching pages</p>
              <p className="mt-1 text-xs text-[var(--notes-muted)]">Try another search term.</p>
            </div>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.page.id}>
                  <button
                    type="button"
                    onClick={() => onSelectResult(r)}
                    className="block w-full border-b border-[var(--notes-border)] px-4 py-3 text-left last:border-b-0 hover:bg-[var(--notes-background)]"
                  >
                    <p className="text-sm font-semibold text-[var(--notes-text)]">
                      {r.page.title || 'Untitled Page'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--notes-muted)]">
                      {r.notebookName}
                      {r.sectionName ? ` → ${r.sectionName}` : ''}
                    </p>
                    {r.snippet && (
                      <p className="mt-1 truncate text-xs italic text-[var(--notes-muted)]">"{r.snippet}"</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
