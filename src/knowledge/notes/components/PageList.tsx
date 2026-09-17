import React from 'react';
import { Page } from '../notes.types';
import { Plus, FileText, Star, Trash2 } from 'lucide-react';

interface PageListProps {
  sectionName: string | null;
  /** True only for the "browse a notebook section" view — gates whether "Select a section" shows vs. a plain empty list. */
  requiresSection?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  pages: Page[];
  selectedPageId: string | null;
  loading: boolean;
  onSelectPage: (page: Page) => void;
  onCreatePage: () => void;
  onDeletePage: (id: string) => void;
  onToggleFavorite: (page: Page) => void;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Updated just now';
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `Updated ${days}d ago`;
  return `Updated ${new Date(iso).toLocaleDateString()}`;
}

export const PageList: React.FC<PageListProps> = ({
  sectionName,
  pages,
  selectedPageId,
  loading,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  onToggleFavorite,
  requiresSection = true,
  emptyTitle = 'This section is empty',
  emptyHint = 'Create a page to start writing.',
}) => {
  const showSelectSectionState = requiresSection && !sectionName;

  return (
    <div className="flex h-full w-full flex-col border-r border-[var(--notes-border)] bg-[var(--notes-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--notes-border)] px-4 py-3">
        <h2 className="truncate text-sm font-bold uppercase tracking-wide text-[var(--notes-muted)]">
          {sectionName || 'Pages'}
        </h2>
        {!showSelectSectionState && requiresSection && (
          <button
            type="button"
            onClick={onCreatePage}
            aria-label="New page"
            title="New page"
            className="rounded-lg p-1.5 text-[var(--notes-primary)] hover:bg-[var(--notes-primary-soft)]"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSelectSectionState ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <FileText className="mb-2 h-8 w-8 text-[var(--notes-muted)]" />
            <p className="text-xs text-[var(--notes-muted)]">Select a section to see its pages.</p>
          </div>
        ) : loading ? (
          <div className="space-y-2 p-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-[var(--notes-background)]" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <FileText className="mb-2 h-8 w-8 text-[var(--notes-muted)]" />
            <p className="text-sm font-semibold text-[var(--notes-text)]">{emptyTitle}</p>
            <p className="mt-1 text-xs text-[var(--notes-muted)]">{emptyHint}</p>
            {requiresSection && (
              <button
                type="button"
                onClick={onCreatePage}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[var(--notes-primary)] px-3 py-1.5 text-xs font-bold text-white"
              >
                <Plus className="h-3.5 w-3.5" /> New Page
              </button>
            )}
          </div>
        ) : (
          <ul>
            {pages.map((page) => {
              const active = page.id === selectedPageId;
              return (
                <li key={page.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelectPage(page)}
                    aria-current={active ? 'true' : undefined}
                    className={`block w-full border-b border-[var(--notes-border)] px-4 py-3 text-left transition-colors ${
                      active ? 'bg-[var(--notes-primary-soft)]' : 'hover:bg-[var(--notes-background)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 pr-12">
                      {page.isFavorite && (
                        <Star className="h-3 w-3 shrink-0 fill-[var(--notes-accent)] text-[var(--notes-accent)]" />
                      )}
                      <span className="truncate text-sm font-semibold text-[var(--notes-text)]">
                        {page.title || 'Untitled Page'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--notes-muted)]">
                      {formatRelativeTime(page.updatedAt)}
                    </p>
                  </button>
                  <div className="absolute right-2 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(page);
                      }}
                      aria-label={page.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      className="rounded-lg p-1 text-[var(--notes-muted)] hover:bg-[var(--notes-accent-soft)] hover:text-[var(--notes-accent)]"
                    >
                      <Star className={`h-3.5 w-3.5 ${page.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePage(page.id);
                      }}
                      aria-label="Delete page"
                      className="rounded-lg p-1 text-[var(--notes-muted)] hover:bg-rose-50 hover:text-[var(--notes-danger)] dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
