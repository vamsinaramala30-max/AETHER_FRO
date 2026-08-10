// ============================================================================
// AETHER AI — Context Builder (RAG Context for Generation)
// ============================================================================
// Builds the context string that is passed to the LLM from RAG results.
// ============================================================================

import type { RAGContext, SourceCitationRef } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

/**
 * Build a formatted context block from RAG retrieval results.
 * This string is included in the generation request for the backend.
 */
export function buildContextBlock(ragContext: RAGContext): string {
  if (ragContext.results.length === 0) return '';

  const maxCharsPerChunk = DEFAULT_AI_CONFIG.rag.maxCharsPerChunk;
  const maxTotal = DEFAULT_AI_CONFIG.rag.maxContextChars;

  const lines: string[] = ['[Retrieved Context]'];
  let totalChars = 0;

  for (const result of ragContext.results) {
    const content = result.chunk.content.slice(0, maxCharsPerChunk);
    const entry = `Source: ${result.documentName}\n${content}`;
    if (totalChars + entry.length > maxTotal) break;
    lines.push(entry);
    totalChars += entry.length;
  }

  return lines.join('\n\n---\n\n');
}

/**
 * Build citation references from a RAGContext for message display.
 */
export function buildCitationsFromRAG(ragContext: RAGContext): SourceCitationRef[] {
  return ragContext.results.map((r, idx) => ({
    id: `rag_${idx}_${r.chunk.id}`,
    title: r.documentName,
    snippet: r.chunk.content.slice(0, 200),
    score: r.score,
    documentId: r.chunk.documentId,
    chunkIndex: r.chunk.index,
  }));
}

/**
 * Check if a RAGContext has meaningful results.
 */
export function hasRAGResults(ragContext: RAGContext | null): boolean {
  return ragContext !== null && ragContext.results.length > 0;
}

export const contextBuilder = {
  buildContextBlock,
  buildCitationsFromRAG,
  hasRAGResults,
};
