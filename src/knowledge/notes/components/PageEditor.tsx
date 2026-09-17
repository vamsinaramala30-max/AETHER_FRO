import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Page, NotesAiAction, SaveStatus } from '../notes.types';
import { notesService } from '../notesService';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link as LinkIcon,
  Table as TableIcon,
  Sparkles,
  Check,
  CloudOff,
  RefreshCw,
  Star,
  Paperclip,
} from 'lucide-react';
import { AttachFileModal, StorageFile } from '@/shared/AttachFileModal';

interface PageEditorProps {
  page: Page;
  onSaved: (page: Page) => void;
  onDeleted: (id: string) => void;
}

const AI_ACTIONS: { action: NotesAiAction; label: string; modifiesContent: boolean }[] = [
  { action: 'SUMMARIZE', label: 'Summarize', modifiesContent: false },
  { action: 'IMPROVE_WRITING', label: 'Improve Writing', modifiesContent: true },
  { action: 'EXPLAIN', label: 'Explain', modifiesContent: false },
  { action: 'GENERATE_OUTLINE', label: 'Generate Outline', modifiesContent: false },
  { action: 'EXTRACT_TASKS', label: 'Extract Tasks', modifiesContent: false },
  { action: 'FIND_KEY_IDEAS', label: 'Find Key Ideas', modifiesContent: false },
  { action: 'CONTINUE_WRITING', label: 'Continue Writing', modifiesContent: true },
];

export const PageEditor: React.FC<PageEditorProps> = ({ page, onSaved, onDeleted }) => {
  const [title, setTitle] = useState(page.title);
  const [isFavorite, setIsFavorite] = useState(page.isFavorite);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState<NotesAiAction | null>(null);
  const [aiResult, setAiResult] = useState<{ action: NotesAiAction; output: string; suggestedContent?: string } | null>(
    null,
  );

  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedHtmlRef = useRef<string>(page.formattedContent || page.content || '');

  // Load page content into the editor whenever the selected page changes.
  useEffect(() => {
    setTitle(page.title);
    setIsFavorite(page.isFavorite);
    setSaveStatus('idle');
    setAiResult(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = page.formattedContent || escapeToHtml(page.content) || '';
    }
    lastSavedHtmlRef.current = page.formattedContent || page.content || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id]);

  const scheduleSave = useCallback(
    (nextTitle: string) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(async () => {
        const html = editorRef.current?.innerHTML || '';
        const plain = editorRef.current?.innerText || '';
        lastSavedHtmlRef.current = html;
        const { page: saved, offline } = await notesService.savePage(page.id, {
          title: nextTitle.trim() || 'Untitled Page',
          content: plain,
          formattedContent: html,
        });
        setSaveStatus(offline ? 'offline' : 'saved');
        onSaved(saved);
      }, 900);
    },
    [page.id, onSaved],
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    scheduleSave(value);
  };

  const handleContentInput = () => {
    scheduleSave(title);
  };

  const retrySave = () => scheduleSave(title);

  // Every button below calls a real formatting command against the
  // contentEditable surface — none of them are no-ops.
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleContentInput();
  };

  const insertChecklistItem = () => {
    editorRef.current?.focus();
    document.execCommand(
      'insertHTML',
      false,
      '<div><input type="checkbox" style="margin-right:6px;" />&nbsp;</div>',
    );
    handleContentInput();
  };

  const insertTable = () => {
    editorRef.current?.focus();
    document.execCommand(
      'insertHTML',
      false,
      `<table style="border-collapse:collapse;margin:8px 0;"><tbody>
        <tr><td style="border:1px solid var(--notes-border);padding:6px 10px;">Header 1</td><td style="border:1px solid var(--notes-border);padding:6px 10px;">Header 2</td></tr>
        <tr><td style="border:1px solid var(--notes-border);padding:6px 10px;">Cell 1</td><td style="border:1px solid var(--notes-border);padding:6px 10px;">Cell 2</td></tr>
      </tbody></table>`,
    );
    handleContentInput();
  };

  const insertLink = () => {
    const url = window.prompt('Link URL');
    if (!url) return;
    exec('createLink', url);
  };

  const toggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    const saved = await notesService.toggleFavorite(page.id, next);
    onSaved(saved);
  };

  const runAi = async (action: NotesAiAction) => {
    setAiMenuOpen(false);
    setAiBusy(action);
    setAiResult(null);
    try {
      const result = await notesService.runAiAction(page.id, action);
      setAiResult({ action, output: result.output, suggestedContent: result.suggestedContent });
    } catch (err: any) {
      setAiResult({ action, output: err?.message || 'Aether AI is not available right now.' });
    } finally {
      setAiBusy(null);
    }
  };

  const applyAiSuggestion = async () => {
    if (!aiResult?.suggestedContent) return;
    const saved = await notesService.applyAiSuggestion(page.id, aiResult.suggestedContent);
    if (editorRef.current) editorRef.current.innerHTML = escapeToHtml(saved.content);
    onSaved(saved);
    setAiResult(null);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--notes-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--notes-border)] px-6 pb-3 pt-5">
        <div className="min-w-0 flex-1">
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled Page"
            aria-label="Page title"
            className="w-full bg-transparent text-[28px] font-extrabold leading-tight tracking-tight text-[var(--notes-text)] outline-none placeholder:text-[var(--notes-muted)]"
          />
          <SaveIndicator status={saveStatus} onRetry={retrySave} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`rounded-xl p-2 ${
              isFavorite
                ? 'bg-[var(--notes-accent-soft)] text-[var(--notes-accent)]'
                : 'text-[var(--notes-muted)] hover:bg-[var(--notes-background)]'
            }`}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAiMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--notes-secondary)] px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" /> Ask Aether
            </button>
            {aiMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-[var(--notes-border)] bg-[var(--notes-surface-raised)] py-1 shadow-lg"
              >
                {AI_ACTIONS.map(({ action, label }) => (
                  <button
                    key={action}
                    role="menuitem"
                    onClick={() => runAi(action)}
                    className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[var(--notes-text)] hover:bg-[var(--notes-background)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDeleted(page.id)}
            className="rounded-xl border border-[var(--notes-border)] px-3 py-2 text-xs font-semibold text-[var(--notes-danger)] hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            Delete
          </button>
        </div>
      </div>

      {aiBusy && (
        <div className="mx-6 mt-3 rounded-xl border border-[var(--notes-border)] bg-[var(--notes-primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--notes-primary)]">
          Aether is working on “{AI_ACTIONS.find((a) => a.action === aiBusy)?.label}”...
        </div>
      )}

      {aiResult && (
        <div className="mx-6 mt-3 rounded-xl border border-[var(--notes-border)] bg-[var(--notes-background)] p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--notes-muted)]">
            {AI_ACTIONS.find((a) => a.action === aiResult.action)?.label || 'Aether'}
          </p>
          <p className="whitespace-pre-wrap text-sm text-[var(--notes-text)]">{aiResult.output}</p>
          {aiResult.suggestedContent && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={applyAiSuggestion}
                className="rounded-lg bg-[var(--notes-primary)] px-3 py-1.5 text-xs font-bold text-white"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setAiResult(null)}
                className="rounded-lg border border-[var(--notes-border)] px-3 py-1.5 text-xs font-semibold text-[var(--notes-muted)]"
              >
                Cancel
              </button>
            </div>
          )}
          {!aiResult.suggestedContent && (
            <button
              type="button"
              onClick={() => setAiResult(null)}
              className="mt-2 text-xs font-semibold text-[var(--notes-muted)] hover:underline"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex flex-wrap items-center gap-1 border-b border-[var(--notes-border)] px-4 py-2"
      >
        <ToolbarButton label="Heading 1" onClick={() => exec('formatBlock', '<h1>')}>
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" onClick={() => exec('formatBlock', '<h2>')}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bold" onClick={() => exec('bold')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => exec('italic')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" onClick={() => exec('underline')}>
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" onClick={() => exec('strikeThrough')}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bulleted list" onClick={() => exec('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => exec('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Checklist" onClick={insertChecklistItem}>
          <CheckSquare className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => exec('formatBlock', '<blockquote>')}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Code block" onClick={() => exec('formatBlock', '<pre>')}>
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Table" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={insertLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <button
          type="button"
          onClick={() => setIsAttachOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-[var(--notes-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--notes-accent)]"
        >
          <Paperclip className="h-3.5 w-3.5" /> Attach File
        </button>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentInput}
          role="textbox"
          aria-multiline="true"
          aria-label="Page content"
          data-placeholder="Start writing..."
          className="notes-editor-body mx-auto max-w-[760px] text-[17px] leading-relaxed text-[var(--notes-text)] outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--notes-border-strong)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_pre]:rounded-lg [&_pre]:bg-[var(--notes-background)] [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
        />
      </div>

      <AttachFileModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        selectedFileIds={[]}
        onSelectFile={(file: StorageFile) => {
          document.execCommand(
            'insertHTML',
            false,
            `<a href="/api/v1/uploads/${file.id}/preview">📎 ${file.filename}</a>`,
          );
          handleContentInput();
          setIsAttachOpen(false);
        }}
      />
    </div>
  );
};

const ToolbarButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({
  label,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className="rounded-lg p-1.5 text-[var(--notes-muted)] hover:bg-[var(--notes-background)] hover:text-[var(--notes-text)]"
  >
    {children}
  </button>
);

const Divider = () => <div className="mx-1 h-4 w-px bg-[var(--notes-border)]" />;

const SaveIndicator: React.FC<{ status: SaveStatus; onRetry: () => void }> = ({ status, onRetry }) => {
  if (status === 'idle') return null;
  if (status === 'saving')
    return (
      <p className="mt-1 text-[11px] font-semibold text-[var(--notes-muted)]">Saving...</p>
    );
  if (status === 'saved')
    return (
      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[var(--notes-success)]">
        <Check className="h-3 w-3" /> Saved just now
      </p>
    );
  if (status === 'offline')
    return (
      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[var(--notes-muted)]">
        <CloudOff className="h-3 w-3" /> Offline — changes saved locally
      </p>
    );
  return (
    <button
      type="button"
      onClick={onRetry}
      className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[var(--notes-danger)] hover:underline"
    >
      <RefreshCw className="h-3 w-3" /> Save failed — Retry
    </button>
  );
};

function escapeToHtml(plain: string): string {
  const div = document.createElement('div');
  div.innerText = plain;
  return div.innerHTML;
}
