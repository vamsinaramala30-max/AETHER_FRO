// frontend/src/knowledge/notes/NotesPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { onActivityUpdate } from '@/shared/activityEvents';
import { NotebookSidebar } from './components/NotebookSidebar';
import { PageList } from './components/PageList';
import { PageEditor } from './components/PageEditor';
import { GlobalSearch } from './components/GlobalSearch';
import { notesService } from './notesService';
import { Notebook, Section, Page, SearchResult } from './notes.types';
import { BookOpen, Menu, Search as SearchIcon, Sparkles, Zap } from 'lucide-react';
import './notes.tokens.css';

type View = 'notes' | 'favorites' | 'recent' | 'trash';
type MobilePane = 'notebooks' | 'sections' | 'pages' | 'editor';

export const NotesPage: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [sectionsByNotebook, setSectionsByNotebook] = useState<Record<string, Section[]>>({});
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [view, setView] = useState<View>('notes');

  const [loadingNotebooks, setLoadingNotebooks] = useState(true);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('notebooks');

  const loadNotebooks = useCallback(async () => {
    try {
      setLoadingNotebooks(true);
      setError(null);
      const data = await notesService.getNotebooks();
      setNotebooks(data);
      const sectionLists = await Promise.all(data.map((nb) => notesService.getSections(nb.id)));
      const map: Record<string, Section[]> = {};
      data.forEach((nb, i) => {
        map[nb.id] = sectionLists[i];
      });
      setSectionsByNotebook(map);

      // Restore or default the selection so the workspace never opens blank.
      if (!selectedSectionId && data.length > 0) {
        const firstNotebook = data[0];
        const firstSection = map[firstNotebook.id]?.[0];
        if (firstSection) {
          setSelectedNotebookId(firstNotebook.id);
          setSelectedSectionId(firstSection.id);
        }
      }
    } catch {
      setError('Failed to load your notebooks. Check your connection and try again.');
    } finally {
      setLoadingNotebooks(false);
    }
  }, [selectedSectionId]);

  useEffect(() => {
    void loadNotebooks();
    const unsubscribe = onActivityUpdate(() => void loadNotebooks());
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPages = useCallback(async () => {
    setLoadingPages(true);
    try {
      if (view === 'favorites') {
        setPages(await notesService.getFavorites());
      } else if (view === 'recent') {
        setPages(await notesService.getRecent());
      } else if (selectedSectionId) {
        const data = await notesService.getPages(selectedSectionId);
        setPages(data.sort((a, b) => a.order - b.order));
      } else {
        setPages([]);
      }
    } finally {
      setLoadingPages(false);
    }
  }, [selectedSectionId, view]);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const currentSection = useMemo(() => {
    if (!selectedNotebookId || !selectedSectionId) return null;
    return sectionsByNotebook[selectedNotebookId]?.find((s) => s.id === selectedSectionId) || null;
  }, [selectedNotebookId, selectedSectionId, sectionsByNotebook]);

  const pageListDisplay = useMemo(() => {
    if (view === 'favorites') {
      return { sectionName: 'Favorites', requiresSection: false, emptyTitle: 'No favorites yet', emptyHint: 'Star a page to pin it here.' };
    }
    if (view === 'recent') {
      return { sectionName: 'Recent', requiresSection: false, emptyTitle: 'Nothing recent', emptyHint: 'Pages you edit will show up here.' };
    }
    return { sectionName: currentSection?.name || null, requiresSection: true, emptyTitle: 'This section is empty', emptyHint: 'Create a page to start writing.' };
  }, [view, currentSection]);

  const handleSelectSection = (notebookId: string, sectionId: string) => {
    setSelectedNotebookId(notebookId);
    setSelectedSectionId(sectionId);
    setSelectedPage(null);
    setView('notes');
    setMobilePane('pages');
  };

  const handleCreateNotebook = async () => {
    const name = window.prompt('Notebook name');
    if (!name?.trim()) return;
    try {
      await notesService.createNotebook(name.trim());
      await loadNotebooks();
    } catch {
      setError('Could not create the notebook. Please try again.');
    }
  };

  const handleCreateSection = async (notebookId: string) => {
    const name = window.prompt('Section name');
    if (!name?.trim()) return;
    await notesService.createSection(notebookId, name.trim());
    await loadNotebooks();
  };

  const handleRenameNotebook = async (notebook: Notebook) => {
    const name = window.prompt('Rename notebook', notebook.name);
    if (!name?.trim() || name === notebook.name) return;
    await notesService.renameNotebook(notebook.id, name.trim());
    await loadNotebooks();
  };

  const handleDeleteNotebook = async (notebook: Notebook) => {
    if (!window.confirm(`Delete "${notebook.name}" and everything inside it? This can be restored from Trash.`)) {
      return;
    }
    await notesService.deleteNotebook(notebook.id);
    if (selectedNotebookId === notebook.id) {
      setSelectedNotebookId(null);
      setSelectedSectionId(null);
      setSelectedPage(null);
    }
    await loadNotebooks();
  };

  const handleCreatePage = async () => {
    if (!selectedSectionId || !selectedNotebookId) return;
    const page = await notesService.createPage(selectedSectionId, selectedNotebookId);
    setPages((prev) => [page, ...prev]);
    setSelectedPage(page);
    setMobilePane('editor');
  };

  const handleQuickNote = async () => {
    const page = await notesService.createQuickNote();
    setSelectedPage(page);
    setMobilePane('editor');
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm('Permanently delete this page?')) return;
    await notesService.deletePage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (selectedPage?.id === id) setSelectedPage(null);
  };

  const handleToggleFavorite = async (page: Page) => {
    const updated = await notesService.toggleFavorite(page.id, !page.isFavorite);
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedPage?.id === updated.id) setSelectedPage(updated);
  };

  const handlePageSaved = (updated: Page) => {
    setSelectedPage(updated);
    setPages((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      return exists ? prev.map((p) => (p.id === updated.id ? updated : p)) : prev;
    });
  };

  const handleSearchResult = (result: SearchResult) => {
    setIsSearchOpen(false);
    if (result.page.notebookId && result.page.sectionId) {
      setSelectedNotebookId(result.page.notebookId);
      setSelectedSectionId(result.page.sectionId);
    }
    setSelectedPage(result.page);
    setMobilePane('editor');
  };

  const hasNotebooks = notebooks.length > 0;

  return (
    <PageWrapper wide>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--notes-border)] pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 shrink-0 text-[var(--notes-primary)]" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--notes-text)]">Aether Notes</h1>
            <p className="mt-0.5 text-xs text-[var(--notes-muted)]">
              Your notebooks, sections, and pages — organized like a real notebook.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--notes-border)] px-3 py-2 text-xs font-semibold text-[var(--notes-muted)] hover:border-[var(--notes-primary)]"
          >
            <SearchIcon className="h-3.5 w-3.5" /> Search
          </button>
          <button
            type="button"
            onClick={handleCreateNotebook}
            className="rounded-xl bg-[var(--notes-primary)] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
          >
            + New Notebook
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-[var(--notes-danger)] dark:border-rose-900/40 dark:bg-rose-950/20">
          <span>{error}</span>
          <button type="button" onClick={() => void loadNotebooks()} className="underline">
            Retry
          </button>
        </div>
      )}

      {loadingNotebooks ? (
        <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--notes-border)]">
          <span className="animate-pulse text-xs font-semibold text-[var(--notes-primary)]">
            Loading your notebooks...
          </span>
        </div>
      ) : !hasNotebooks ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[var(--notes-border)] bg-[var(--notes-surface)] py-16 text-center">
          <Sparkles className="mb-3 h-10 w-10 text-[var(--notes-primary)]" />
          <p className="text-base font-bold text-[var(--notes-text)]">Create your first notebook</p>
          <p className="mt-1 max-w-xs text-xs text-[var(--notes-muted)]">
            Organize your ideas, research and writing in one place.
          </p>
          <button
            type="button"
            onClick={handleCreateNotebook}
            className="mt-4 rounded-xl bg-[var(--notes-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
          >
            + Create Notebook
          </button>
        </div>
      ) : (
        <>
          {/* Desktop: three-pane workspace */}
          <div className="mt-4 hidden h-[calc(100vh-220px)] min-h-[520px] overflow-hidden rounded-2xl border border-[var(--notes-border)] shadow-sm md:grid md:grid-cols-[220px_260px_1fr]">
            <NotebookSidebar
              notebooks={notebooks}
              sectionsByNotebook={sectionsByNotebook}
              selectedNotebookId={selectedNotebookId}
              selectedSectionId={selectedSectionId}
              view={view}
              onSelectSection={handleSelectSection}
              onSelectView={(v) => setView(v)}
              onCreateNotebook={handleCreateNotebook}
              onCreateSection={handleCreateSection}
              onRenameNotebook={handleRenameNotebook}
              onDeleteNotebook={handleDeleteNotebook}
              onOpenSearch={() => setIsSearchOpen(true)}
              onQuickNote={handleQuickNote}
            />
            <PageList
              {...pageListDisplay}
              pages={pages}
              selectedPageId={selectedPage?.id || null}
              loading={loadingPages}
              onSelectPage={setSelectedPage}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
              onToggleFavorite={handleToggleFavorite}
            />
            {selectedPage ? (
              <PageEditor page={selectedPage} onSaved={handlePageSaved} onDeleted={handleDeletePage} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <BookOpen className="mb-3 h-10 w-10 text-[var(--notes-muted)]" />
                <p className="text-sm font-semibold text-[var(--notes-text)]">Select or create a page</p>
                <p className="mt-1 text-xs text-[var(--notes-muted)]">Your writing shows up here.</p>
              </div>
            )}
          </div>

          {/* Mobile: single-pane with bottom nav switching between drawers */}
          <div className="mt-4 flex h-[calc(100vh-200px)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[var(--notes-border)] md:hidden">
            <div className="flex items-center justify-between border-b border-[var(--notes-border)] px-3 py-2">
              <button
                type="button"
                onClick={() => setMobilePane('notebooks')}
                aria-label="Notebooks"
                className="rounded-lg p-2 text-[var(--notes-muted)] hover:bg-[var(--notes-background)]"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span className="truncate text-xs font-bold text-[var(--notes-text)]">
                {currentSection?.name || 'Notes'}
              </span>
              <button
                type="button"
                onClick={handleQuickNote}
                aria-label="Quick note"
                className="rounded-lg p-2 text-[var(--notes-primary)] hover:bg-[var(--notes-primary-soft)]"
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {mobilePane === 'notebooks' && (
                <NotebookSidebar
                  notebooks={notebooks}
                  sectionsByNotebook={sectionsByNotebook}
                  selectedNotebookId={selectedNotebookId}
                  selectedSectionId={selectedSectionId}
                  view={view}
                  onSelectSection={handleSelectSection}
                  onSelectView={(v) => {
                    setView(v);
                    setMobilePane('pages');
                  }}
                  onCreateNotebook={handleCreateNotebook}
                  onCreateSection={handleCreateSection}
                  onRenameNotebook={handleRenameNotebook}
                  onDeleteNotebook={handleDeleteNotebook}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onQuickNote={handleQuickNote}
                />
              )}
              {mobilePane === 'pages' && (
                <PageList
                  {...pageListDisplay}
                  pages={pages}
                  selectedPageId={selectedPage?.id || null}
                  loading={loadingPages}
                  onSelectPage={(p) => {
                    setSelectedPage(p);
                    setMobilePane('editor');
                  }}
                  onCreatePage={handleCreatePage}
                  onDeletePage={handleDeletePage}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              {mobilePane === 'editor' &&
                (selectedPage ? (
                  <PageEditor page={selectedPage} onSaved={handlePageSaved} onDeleted={handleDeletePage} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <BookOpen className="mb-3 h-10 w-10 text-[var(--notes-muted)]" />
                    <p className="text-sm font-semibold text-[var(--notes-text)]">No page selected</p>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-3 border-t border-[var(--notes-border)] text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setMobilePane('notebooks')}
                className={`py-2.5 ${mobilePane === 'notebooks' ? 'text-[var(--notes-primary)]' : 'text-[var(--notes-muted)]'}`}
              >
                Notebooks
              </button>
              <button
                type="button"
                onClick={() => setMobilePane('pages')}
                className={`py-2.5 ${mobilePane === 'pages' ? 'text-[var(--notes-primary)]' : 'text-[var(--notes-muted)]'}`}
              >
                Pages
              </button>
              <button
                type="button"
                onClick={() => setMobilePane('editor')}
                className={`py-2.5 ${mobilePane === 'editor' ? 'text-[var(--notes-primary)]' : 'text-[var(--notes-muted)]'}`}
              >
                Editor
              </button>
            </div>
          </div>
        </>
      )}

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectResult={handleSearchResult} />
    </PageWrapper>
  );
};
