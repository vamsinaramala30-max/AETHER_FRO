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

import { apiClient } from '../../api/client';

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
    try {
      const res = await apiClient.post<Record<string, unknown>>(
        `${this.config.backend.knowledgePath}/documents/search`,
        {
          query: request.query,
          topK: request.topK ?? this.config.rag.topK,
        },
        { timeout: 15_000 }
      );

      const raw = (res && typeof res === 'object' && 'data' in res && typeof res.data === 'object' && res.data !== null)
        ? (res.data as Record<string, unknown>)
        : (res as Record<string, unknown>);

      // Support backend RAGResult shape: { documents: [...], citations: [...] } or { results: [...] }
      const rawDocs = Array.isArray(raw['documents'])
        ? (raw['documents'] as Array<Record<string, unknown>>)
        : Array.isArray(raw['results'])
        ? (raw['results'] as Array<Record<string, unknown>>)
        : [];

      const results = rawDocs.map((item, idx) => {
        const chunkObj = (typeof item['chunk'] === 'object' && item['chunk'] !== null)
          ? (item['chunk'] as Record<string, unknown>)
          : item;
        return {
          chunk: {
            id: typeof chunkObj['id'] === 'string' ? chunkObj['id'] : `chunk_${idx}`,
            documentId: typeof chunkObj['documentId'] === 'string' ? chunkObj['documentId'] : (typeof chunkObj['document_id'] === 'string' ? chunkObj['document_id'] : ''),
            content: typeof chunkObj['content'] === 'string' ? chunkObj['content'] : '',
            index: typeof chunkObj['index'] === 'number' ? chunkObj['index'] : (typeof chunkObj['chunk_index'] === 'number' ? chunkObj['chunk_index'] : idx),
          },
          score: typeof item['score'] === 'number' ? item['score'] : 0.85,
          documentName: typeof item['documentName'] === 'string' ? item['documentName'] : (typeof item['title'] === 'string' ? item['title'] : 'Knowledge Document'),
        };
      });

      return {
        success: true,
        data: {
          query: request.query,
          results,
          totalRetrieved: typeof raw['totalRetrieved'] === 'number' ? raw['totalRetrieved'] : results.length,
          retrievedAt: Date.now(),
          rerankApplied: raw['rerank_applied'] === true,
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
    try {
      const res = await apiClient.get<Record<string, unknown>>(
        `${this.config.backend.knowledgePath}/stats`,
        { timeout: 5_000 }
      );
      const raw = (res && typeof res === 'object' && 'data' in res && typeof res.data === 'object' && res.data !== null)
        ? (res.data as Record<string, unknown>)
        : (res as Record<string, unknown>);

      return {
        success: true,
        data: {
          enabled: true,
          documentCount: typeof raw['totalDocuments'] === 'number' ? raw['totalDocuments'] : (typeof raw['document_count'] === 'number' ? raw['document_count'] : 0),
          indexedCount: typeof raw['indexedDocuments'] === 'number' ? raw['indexedDocuments'] : (typeof raw['indexed_count'] === 'number' ? raw['indexed_count'] : 0),
          pendingCount: typeof raw['pendingCount'] === 'number' ? raw['pendingCount'] : 0,
          errorCount: typeof raw['errorCount'] === 'number' ? raw['errorCount'] : 0,
          lastIndexedAt: typeof raw['lastIndexedAt'] === 'number' ? raw['lastIndexedAt'] : undefined,
        },
      };
    } catch {
      return {
        success: true,
        data: {
          enabled: true,
          documentCount: 0,
          indexedCount: 0,
          pendingCount: 0,
          errorCount: 0,
        },
      };
    }
  }
}

export const ragEngine = new RAGEngine();
