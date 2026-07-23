// frontend/src/knowledge/types.ts

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  tags: string[];
  createdAt: string;
  userId: string;
  type: string;
  updatedAt: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'note' | 'document' | 'concept';
  connections: string[];
}

export interface SearchResult {
  id: string;
  type: 'note' | 'document';
  title: string;
  snippet: string;
  score: number;
  date: string;
}

