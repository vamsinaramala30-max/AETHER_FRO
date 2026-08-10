// ============================================================================
// AETHER AI — Chunker (Frontend Status Abstraction)
// ============================================================================
// Represents chunking state returned by the AETHER backend.
// The frontend does NOT perform chunking — it only displays backend state.
// ============================================================================

import type { RAGChunk } from '../ai-types';

/**
 * Represents chunking configuration sent to the backend.
 */
export interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
  strategy: 'fixed' | 'sentence' | 'paragraph' | 'semantic';
}

export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  chunkSize: 512,
  chunkOverlap: 64,
  strategy: 'sentence',
};

/**
 * Normalize a raw backend chunk into a typed RAGChunk.
 */
export function normalizeChunk(raw: Record<string, unknown>): RAGChunk {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `chunk_${Date.now()}`,
    documentId: typeof raw['document_id'] === 'string' ? raw['document_id'] : '',
    content: typeof raw['content'] === 'string' ? raw['content'] : '',
    index: typeof raw['index'] === 'number' ? raw['index'] : 0,
    tokenCount: typeof raw['token_count'] === 'number' ? raw['token_count'] : undefined,
    // embedding is never sent to the frontend
  };
}

/**
 * Get a display summary for a chunk.
 */
export function chunkPreview(chunk: RAGChunk, maxChars = 200): string {
  if (chunk.content.length <= maxChars) return chunk.content;
  return chunk.content.slice(0, maxChars) + '…';
}

export const chunker = {
  normalizeChunk,
  chunkPreview,
  DEFAULT_CHUNKING_CONFIG,
};
