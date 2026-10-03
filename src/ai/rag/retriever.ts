// ============================================================================
// AETHER AI — Retriever (Frontend Abstraction)
// ============================================================================
// Provides typed request/result structures for retrieval.
// Actual retrieval is performed by the AETHER backend.
// ============================================================================

import type { RetrievalResult, RAGContext, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { apiClient, ApiError } from '../../api/client';

export interface RetrieverQuery {
  text: string;
  conversationId: string;
  collectionIds?: string[];
  topK?: number;
  minScore?: number;
  filters?: Record<string, string>;
}

/**
 * Request retrieval from the AETHER backend via authenticated apiClient.
 * Never invents retrieval results.
 */
export async function retrieve(query: RetrieverQuery): Promise<AIResult<RAGContext>> {
  const endpoint = `${DEFAULT_AI_CONFIG.backend.knowledgePath}/retrieve`;
  try {
    const raw = await apiClient.post<{
      results?: Array<Record<string, unknown>>;
      total?: number;
      rerank_applied?: boolean;
      data?: {
        documents?: Array<Record<string, unknown>>;
        totalRetrieved?: number;
      };
    }>(
      endpoint,
      {
        query: query.text,
        conversation_id: query.conversationId,
        collection_ids: query.collectionIds,
        top_k: query.topK ?? DEFAULT_AI_CONFIG.rag.topK,
        min_score: query.minScore ?? DEFAULT_AI_CONFIG.rag.minScore,
        filters: query.filters,
      },
      {
        timeout: 15_000,
      },
    );

    const rawResults = raw.results ?? (raw.data as any)?.documents ?? [];
    const results: RetrievalResult[] = (rawResults ?? []).flatMap((r: any) => {
      if (typeof r !== 'object' || r === null) return [];
      return [
        {
          chunk: {
            id: typeof r['chunk_id'] === 'string' ? r['chunk_id'] : (typeof r['id'] === 'string' ? r['id'] : ''),
            documentId: typeof r['document_id'] === 'string' ? r['document_id'] : (typeof r['documentId'] === 'string' ? r['documentId'] : ''),
            content: typeof r['content'] === 'string' ? r['content'] : (typeof r['text'] === 'string' ? r['text'] : ''),
            index: typeof r['chunk_index'] === 'number' ? r['chunk_index'] : (typeof r['chunkIndex'] === 'number' ? r['chunkIndex'] : 0),
          },
          score: typeof r['score'] === 'number' ? r['score'] : 0,
          documentName: typeof r['document_name'] === 'string' ? r['document_name'] : (typeof r['title'] === 'string' ? r['title'] : 'Unknown'),
        },
      ];
    });

    return {
      success: true,
      data: {
        query: query.text,
        results,
        totalRetrieved: raw.total ?? (raw.data as any)?.totalRetrieved ?? results.length,
        retrievedAt: Date.now(),
        rerankApplied: raw.rerank_applied ?? false,
      },
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return {
        success: false,
        error: {
          code: err.status === 401 ? 'UNAUTHORIZED' : (err.status === 403 ? 'FORBIDDEN' : 'RAG_FAILED'),
          message: err.message || `Retrieval failed with HTTP ${err.status}`,
          timestamp: Date.now(),
        },
      };
    }
    return {
      success: false,
      error: {
        code: 'RAG_FAILED',
        message: err instanceof Error ? err.message : 'Cannot connect to the AETHER retrieval backend.',
        timestamp: Date.now(),
      },
    };
  }
}

export const retriever = { retrieve };
