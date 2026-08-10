// ============================================================================
// AETHER AI — RAG Engine (Frontend Abstraction)
// ============================================================================
// Coordinates retrieval-augmented generation workflow on the frontend.
// All actual embedding/retrieval is done by the AETHER backend.
// ============================================================================

import type { RAGContext, RAGStatus, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

export interface RAGQueryRequest {
  query: string;
  conversationId: string;
  topK?: number;
  minScore?: number;
  rerankEnabled?: boolean;
  collectionIds?: string[];
}

/**
 * RAGEngine coordinates retrieval requests to the AETHER backend.
 * The frontend never performs embedding or vector search directly.
 */
export class RAGEngine {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Request a RAG retrieval from the AETHER backend.
   * Returns a RAGContext with backend-provided results only.
   */
  async retrieve(request: RAGQueryRequest): Promise<AIResult<RAGContext>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.knowledgePath}/retrieve`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: request.query,
          conversation_id: request.conversationId,
          top_k: request.topK ?? this.config.rag.topK,
          min_score: request.minScore ?? this.config.rag.minScore,
          rerank_enabled: request.rerankEnabled ?? this.config.rag.rerankEnabled,
          collection_ids: request.collectionIds,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        return {
          success: false,
          error: {
            code: 'RAG_FAILED',
            message: `RAG retrieval failed with HTTP ${res.status}`,
            timestamp: Date.now(),
          },
        };
      }

      const raw = await res.json() as {
        results?: unknown[];
        total?: number;
        rerank_applied?: boolean;
      };

      const results = Array.isArray(raw.results)
        ? raw.results.flatMap((r) => {
            if (typeof r !== 'object' || r === null) return [];
            const item = r as Record<string, unknown>;
            return [{
              chunk: {
                id: typeof item['chunk_id'] === 'string' ? item['chunk_id'] : '',
                documentId: typeof item['document_id'] === 'string' ? item['document_id'] : '',
                content: typeof item['content'] === 'string' ? item['content'] : '',
                index: typeof item['chunk_index'] === 'number' ? item['chunk_index'] : 0,
              },
              score: typeof item['score'] === 'number' ? item['score'] : 0,
              documentName: typeof item['document_name'] === 'string' ? item['document_name'] : 'Unknown',
            }];
          })
        : [];

      return {
        success: true,
        data: {
          query: request.query,
          results,
          totalRetrieved: raw.total ?? results.length,
          retrievedAt: Date.now(),
          rerankApplied: raw.rerank_applied ?? false,
        },
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: 'Cannot reach the AETHER RAG backend.',
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Fetch current RAG index status.
   */
  async getStatus(): Promise<AIResult<RAGStatus>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.knowledgePath}/status`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      if (!res.ok) {
        return {
          success: false,
          error: {
            code: 'RAG_FAILED',
            message: 'Failed to fetch RAG status.',
            timestamp: Date.now(),
          },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return {
        success: true,
        data: {
          enabled: raw['enabled'] === true,
          documentCount: typeof raw['document_count'] === 'number' ? raw['document_count'] : 0,
          indexedCount: typeof raw['indexed_count'] === 'number' ? raw['indexed_count'] : 0,
          pendingCount: typeof raw['pending_count'] === 'number' ? raw['pending_count'] : 0,
          errorCount: typeof raw['error_count'] === 'number' ? raw['error_count'] : 0,
          lastIndexedAt: typeof raw['last_indexed_at'] === 'number' ? raw['last_indexed_at'] : undefined,
        },
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: 'Cannot fetch RAG status.',
          timestamp: Date.now(),
        },
      };
    }
  }
}

export const ragEngine = new RAGEngine();
