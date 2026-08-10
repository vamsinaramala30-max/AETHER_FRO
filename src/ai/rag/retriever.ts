// ============================================================================
// AETHER AI — Retriever (Frontend Abstraction)
// ============================================================================
// Provides typed request/result structures for retrieval.
// Actual retrieval is performed by the AETHER backend.
// ============================================================================

import type { RetrievalResult, RAGContext, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

export interface RetrieverQuery {
  text: string;
  conversationId: string;
  collectionIds?: string[];
  topK?: number;
  minScore?: number;
  filters?: Record<string, string>;
}

/**
 * Request retrieval from the AETHER backend.
 * Never invents retrieval results.
 */
export async function retrieve(query: RetrieverQuery): Promise<AIResult<RAGContext>> {
  const url = `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.knowledgePath}/retrieve`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query.text,
        conversation_id: query.conversationId,
        collection_ids: query.collectionIds,
        top_k: query.topK ?? DEFAULT_AI_CONFIG.rag.topK,
        min_score: query.minScore ?? DEFAULT_AI_CONFIG.rag.minScore,
        filters: query.filters,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: `Retrieval failed with HTTP ${res.status}`,
          timestamp: Date.now(),
        },
      };
    }

    const raw = await res.json() as {
      results?: Array<Record<string, unknown>>;
      total?: number;
      rerank_applied?: boolean;
    };

    const results: RetrievalResult[] = (raw.results ?? []).flatMap((r) => {
      if (typeof r !== 'object' || r === null) return [];
      return [{
        chunk: {
          id: typeof r['chunk_id'] === 'string' ? r['chunk_id'] : '',
          documentId: typeof r['document_id'] === 'string' ? r['document_id'] : '',
          content: typeof r['content'] === 'string' ? r['content'] : '',
          index: typeof r['chunk_index'] === 'number' ? r['chunk_index'] : 0,
        },
        score: typeof r['score'] === 'number' ? r['score'] : 0,
        documentName: typeof r['document_name'] === 'string' ? r['document_name'] : 'Unknown',
      }];
    });

    return {
      success: true,
      data: {
        query: query.text,
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
        message: 'Cannot connect to the AETHER retrieval backend.',
        timestamp: Date.now(),
      },
    };
  }
}

export const retriever = { retrieve };
