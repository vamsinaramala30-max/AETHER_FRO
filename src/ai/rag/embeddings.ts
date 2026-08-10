// ============================================================================
// AETHER AI — Embeddings (Frontend Status Abstraction)
// ============================================================================
// Represents embedding status. The frontend does NOT compute embeddings.
// All embedding is performed by the AETHER backend embedding service.
// ============================================================================

/**
 * Frontend representation of embedding status for a document.
 */
export interface EmbeddingStatus {
  documentId: string;
  totalChunks: number;
  embeddedChunks: number;
  progress: number; // 0–100
  model: string;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

/**
 * Normalize raw backend embedding status payload.
 */
export function normalizeEmbeddingStatus(raw: Record<string, unknown>): EmbeddingStatus {
  const total = typeof raw['total_chunks'] === 'number' ? raw['total_chunks'] : 0;
  const embedded = typeof raw['embedded_chunks'] === 'number' ? raw['embedded_chunks'] : 0;
  const progress = total > 0 ? Math.round((embedded / total) * 100) : 0;

  return {
    documentId: typeof raw['document_id'] === 'string' ? raw['document_id'] : '',
    totalChunks: total,
    embeddedChunks: embedded,
    progress,
    model: typeof raw['embedding_model'] === 'string' ? raw['embedding_model'] : 'unknown',
    startedAt: typeof raw['started_at'] === 'number' ? raw['started_at'] : undefined,
    completedAt: typeof raw['completed_at'] === 'number' ? raw['completed_at'] : undefined,
    error: typeof raw['error'] === 'string' ? raw['error'] : undefined,
  };
}

/**
 * Format embedding progress for display.
 */
export function formatEmbeddingProgress(status: EmbeddingStatus): string {
  if (status.error) return `Error: ${status.error}`;
  if (status.completedAt) return 'Embedding complete';
  if (status.startedAt) {
    return `Embedding ${status.embeddedChunks}/${status.totalChunks} chunks (${status.progress}%)`;
  }
  return 'Waiting to embed…';
}

export const embeddings = {
  normalizeEmbeddingStatus,
  formatEmbeddingProgress,
};
