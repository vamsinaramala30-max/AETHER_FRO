import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { useNotificationStore } from '@/state/notificationStore';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Paperclip,
  Check,
  Sparkles,
  Save,
  Tag as TagIcon,
  Table as TableIcon,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { AttachFileModal, StorageFile } from '@/shared/AttachFileModal';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<StorageFile[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const predefinedTags = ['work', 'project', 'idea', 'meeting', 'research', 'important'];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
      setIsPinned(Boolean(note.isPinned));
    } else {
      setTitle('');
      setContent('');
      setTags(['idea']);
      setIsPinned(false);
    }
  }, [note]);

  // Debounced Autosave
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);

    autosaveTimeoutRef.current = setTimeout(() => {
      onSave({
        id: note?.id ?? '',
        title: title || 'Untitled Note',
        content,
        tags,
        isPinned,
      });
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);

    return () => {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    };
  }, [title, content, tags, isPinned]);

  const toggleTag = (tag: string) => {
    const clean = tag.replace(/^#/, '').trim().toLowerCase();
    if (!clean) return;
    if (tags.includes(clean)) {
      setTags(tags.filter((t) => t !== clean));
    } else {
      setTags([...tags, clean]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customTagInput.trim()) {
        toggleTag(customTagInput);
        setCustomTagInput('');
      }
    }
  };

  const insertText = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}${suffix}`);
  };

  const insertBlock = (blockType: string) => {
    if (blockType === 'checklist') insertText('- [ ] ');
    if (blockType === 'callout') insertText('> 💡 **Note**: ');
    if (blockType === 'quote') insertText('> ');
    if (blockType === 'code') insertText('```typescript\n// Write code here\n```\n');
    if (blockType === 'table') insertText('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n');
    if (blockType === 'h1') insertText('# ');
    if (blockType === 'h2') insertText('## ');
    if (blockType === 'h3') insertText('### ');
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Editor Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {note ? 'Edit Note' : 'Create Rich Note'}
          </h3>
          {lastSavedTime && (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" /> Autosaved at {lastSavedTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              isPinned
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {isPinned ? '★ Pinned' : '☆ Pin Note'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>

      {/* Note Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full bg-transparent text-xl font-extrabold tracking-tight text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
      </div>

      {/* Tag Selector */}
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        <TagIcon className="h-3.5 w-3.5 text-slate-400" />
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
              tags.includes(tag)
                ? 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300 border border-amber-500/40'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            #{tag}
          </button>
        ))}

        <input
          type="text"
          placeholder="+ Add custom tag"
          value={customTagInput}
          onChange={(e) => setCustomTagInput(e.target.value)}
          onKeyDown={handleAddCustomTag}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800 outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 dark:border-slate-800 dark:bg-slate-800/50">
        <button
          type="button"
          onClick={() => insertBlock('h1')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('h2')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('h3')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertText('**', '**')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-bold"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertText('*', '*')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 italic"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertText('~~', '~~')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 line-through"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => insertBlock('checklist')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Checklist"
        >
          <CheckSquare className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('callout')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Callout Box"
        >
          <HelpCircle className="h-4 w-4 text-amber-500" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('quote')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('code')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertBlock('table')}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Table"
        >
          <TableIcon className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => setIsAttachModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 hover:bg-amber-500/20"
          title="Attach Existing Workspace File"
        >
          <Paperclip className="h-3.5 w-3.5" />
          <span>Attach File</span>
        </button>
      </div>

      {/* Editor Body */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing note content with markdown formatting, checklists, quotes, and code blocks..."
          rows={12}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs leading-relaxed text-slate-900 outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-white"
        />
      </div>

      {/* Attached Files List */}
      {attachedFiles.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Referenced Workspace Files ({attachedFiles.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Paperclip className="h-3 w-3 text-amber-500" />
                {f.filename}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-[11px] text-slate-400">
          Edits autosave automatically while typing.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Done
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({
                id: note?.id ?? '',
                title: title || 'Untitled Note',
                content,
                tags,
                isPinned,
              });
              onCancel();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-500"
          >
            <Save className="h-4 w-4" /> Save & Close
          </button>
        </div>
      </div>

      {/* Attach File Modal */}
      <AttachFileModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        selectedFileIds={attachedFiles.map((f) => f.id)}
        onSelectFile={(file) => {
          if (!attachedFiles.some((f) => f.id === file.id)) {
            setAttachedFiles((prev) => [...prev, file]);
            insertText(`\n[Attached File: ${file.filename}](/api/v1/uploads/${file.id}/preview)\n`);
          }
        }}
      />
    </div>
  );
};
