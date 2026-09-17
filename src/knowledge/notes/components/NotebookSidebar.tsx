import React, { useState } from 'react';
import { Notebook, Section } from '../notes.types';
import {
  Book,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Search,
  Star,
  Clock,
  Trash2,
  Zap,
} from 'lucide-react';

interface NotebookSidebarProps {
  notebooks: Notebook[];
  sectionsByNotebook: Record<string, Section[]>;
  selectedNotebookId: string | null;
  selectedSectionId: string | null;
  view: 'notes' | 'favorites' | 'recent' | 'trash';
  onSelectSection: (notebookId: string, sectionId: string) => void;
  onSelectView: (view: 'favorites' | 'recent' | 'trash') => void;
  onCreateNotebook: () => void;
  onCreateSection: (notebookId: string) => void;
  onRenameNotebook: (notebook: Notebook) => void;
  onDeleteNotebook: (notebook: Notebook) => void;
  onOpenSearch: () => void;
  onQuickNote: () => void;
}

export const NotebookSidebar: React.FC<NotebookSidebarProps> = ({
  notebooks,
  sectionsByNotebook,
  selectedNotebookId,
  selectedSectionId,
  view,
  onSelectSection,
  onSelectView,
  onCreateNotebook,
  onCreateSection,
  onRenameNotebook,
  onDeleteNotebook,
  onOpenSearch,
  onQuickNote,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav
      aria-label="Notebooks"
      className="flex h-full w-full flex-col border-r border-[var(--notes-border)] bg-[var(--notes-surface)]"
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--notes-muted)]">
          Aether Notes
        </span>
      </div>

      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex w-full items-center gap-2 rounded-xl border border-[var(--notes-border)] bg-[var(--notes-background)] px-3 py-2 text-xs font-medium text-[var(--notes-muted)] transition-colors hover:border-[var(--notes-primary)]"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Search notes...</span>
        </button>
      </div>

      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={onQuickNote}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--notes-primary)] px-3 py-2 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Quick Note
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--notes-muted)]">
          Notebooks
        </span>
        <button
          type="button"
          onClick={onCreateNotebook}
          aria-label="New notebook"
          title="New notebook"
          className="rounded-lg p-1 text-[var(--notes-muted)] hover:bg-[var(--notes-primary-soft)] hover:text-[var(--notes-primary)]"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {notebooks.length === 0 ? (
          <p className="px-2 py-3 text-xs text-[var(--notes-muted)]">No notebooks yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {notebooks.map((notebook) => {
              const isOpen = expanded[notebook.id] ?? notebook.id === selectedNotebookId;
              const sections = sectionsByNotebook[notebook.id] || [];
              return (
                <li key={notebook.id}>
                  <div className="group flex items-center rounded-lg pr-1 hover:bg-[var(--notes-background)]">
                    <button
                      type="button"
                      onClick={() => toggle(notebook.id)}
                      className="flex flex-1 items-center gap-1.5 px-2 py-1.5 text-left"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--notes-muted)]" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--notes-muted)]" />
                      )}
                      <Book className="h-3.5 w-3.5 shrink-0 text-[var(--notes-primary)]" />
                      <span className="truncate text-sm font-semibold text-[var(--notes-text)]">
                        {notebook.name}
                      </span>
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuFor(menuFor === notebook.id ? null : notebook.id)}
                        aria-label={`More options for ${notebook.name}`}
                        className="rounded-lg p-1 text-[var(--notes-muted)] opacity-0 hover:bg-[var(--notes-border)] group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                      {menuFor === notebook.id && (
                        <div
                          role="menu"
                          className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-[var(--notes-border)] bg-[var(--notes-surface-raised)] py-1 shadow-lg"
                        >
                          <button
                            role="menuitem"
                            onClick={() => {
                              onCreateSection(notebook.id);
                              setMenuFor(null);
                              setExpanded((p) => ({ ...p, [notebook.id]: true }));
                            }}
                            className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[var(--notes-text)] hover:bg-[var(--notes-background)]"
                          >
                            New Section
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              onRenameNotebook(notebook);
                              setMenuFor(null);
                            }}
                            className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[var(--notes-text)] hover:bg-[var(--notes-background)]"
                          >
                            Rename
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              onDeleteNotebook(notebook);
                              setMenuFor(null);
                            }}
                            className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[var(--notes-danger)] hover:bg-[var(--notes-background)]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <ul className="ml-6 space-y-0.5 border-l border-[var(--notes-border)] pl-2">
                      {sections.map((section) => {
                        const active = section.id === selectedSectionId;
                        return (
                          <li key={section.id}>
                            <button
                              type="button"
                              onClick={() => onSelectSection(notebook.id, section.id)}
                              aria-current={active ? 'true' : undefined}
                              className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                                active
                                  ? 'border border-[var(--notes-primary)]/30 bg-[var(--notes-primary-soft)] text-[var(--notes-primary)]'
                                  : 'text-[var(--notes-muted)] hover:bg-[var(--notes-background)] hover:text-[var(--notes-text)]'
                              }`}
                            >
                              {section.name}
                            </button>
                          </li>
                        );
                      })}
                      {sections.length === 0 && (
                        <li className="px-2 py-1 text-[11px] italic text-[var(--notes-muted)]">
                          No sections yet
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="space-y-0.5 border-t border-[var(--notes-border)] px-2 py-2">
        <button
          type="button"
          onClick={() => onSelectView('favorites')}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold ${
            view === 'favorites'
              ? 'bg-[var(--notes-primary-soft)] text-[var(--notes-primary)]'
              : 'text-[var(--notes-muted)] hover:bg-[var(--notes-background)]'
          }`}
        >
          <Star className="h-3.5 w-3.5" /> Favorites
        </button>
        <button
          type="button"
          onClick={() => onSelectView('recent')}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold ${
            view === 'recent'
              ? 'bg-[var(--notes-primary-soft)] text-[var(--notes-primary)]'
              : 'text-[var(--notes-muted)] hover:bg-[var(--notes-background)]'
          }`}
        >
          <Clock className="h-3.5 w-3.5" /> Recent
        </button>
        <button
          type="button"
          onClick={() => onSelectView('trash')}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold ${
            view === 'trash'
              ? 'bg-[var(--notes-primary-soft)] text-[var(--notes-primary)]'
              : 'text-[var(--notes-muted)] hover:bg-[var(--notes-background)]'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" /> Trash
        </button>
      </div>
    </nav>
  );
};
