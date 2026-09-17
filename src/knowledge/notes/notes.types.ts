/**
 * ASSUMPTION: I don't have ../types (the original Note interface) in this
 * upload, so its shape is inferred from usage across notecard.tsx,
 * noteeditor.tsx, noteservice.ts (id, title, content, tags, isPinned,
 * createdAt, updatedAt, userId). Add the fields below into that shared
 * file — Page is defined here as an extension so it stays compatible with
 * whatever else in the app already imports Note from ../types.
 */
import type { Note } from '../types';

export interface Notebook {
  id: string;
  name: string;
  description?: string;
  color?: string; // 'indigo' | 'purple' | 'amber' | ...
  order: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  notebookId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page extends Note {
  formattedContent?: string;
  category: string;
  notebookId: string | null;
  sectionId: string | null;
  order: number;
  isFavorite: boolean;
  isArchived: boolean;
  isQuickNote: boolean;
}

export type NotesAiAction =
  | 'ASK'
  | 'SUMMARIZE'
  | 'IMPROVE_WRITING'
  | 'EXPLAIN'
  | 'GENERATE_OUTLINE'
  | 'EXTRACT_TASKS'
  | 'FIND_KEY_IDEAS'
  | 'CONTINUE_WRITING';

export interface NotesAiResult {
  output: string;
  suggestedContent?: string;
}

export interface SearchResult {
  page: Page;
  notebookName: string;
  sectionName: string;
  /** Short plain-text excerpt around the match, for display only. */
  snippet: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';
