// ============================================================================
// AETHER AI — Knowledge Service
// ============================================================================

import type { AIDocument, RAGStatus, AIResult } from '../ai-types';
import { ragEngine } from '../rag/rag-engine';
import { uploadDocument } from '../rag/document-parser';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { normalizeDocument } from '../rag/document-parser';

import { apiClient } from '../../api/client';

/**
 * KnowledgeService isolates all knowledge/RAG backend operations.
 */
export class KnowledgeService {
  private readonly config = DEFAULT_AI_CONFIG;

  async getStatus(): Promise<AIResult<RAGStatus>> {
    return ragEngine.getStatus();
  }

  async listDocuments(): Promise<AIResult<AIDocument[]>> {
    try {
      const res = await apiClient.get<Record<string, unknown> | unknown[]>(
        `${this.config.backend.knowledgePath}/documents`,
        { timeout: 10_000 }
      );

      let rawArray: unknown[] = [];
      if (Array.isArray(res)) {
        rawArray = res;
      } else if (res && typeof res === 'object') {
        const payload = res as Record<string, unknown>;
        if (Array.isArray(payload['data'])) {
          rawArray = payload['data'];
        } else if (Array.isArray(payload['documents'])) {
          rawArray = payload['documents'];
        }
      }

      return {
        success: true,
        data: rawArray
          .filter((d): d is Record<string, unknown> => typeof d === 'object' && d !== null)
          .map(normalizeDocument),
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: 'Cannot load documents from knowledge service.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async uploadDocument(file: File, collectionId?: string): Promise<AIResult<AIDocument>> {
    return uploadDocument({ file, collectionId });
  }

  async deleteDocument(id: string): Promise<AIResult<void>> {
    try {
      await apiClient.delete(
        `${this.config.backend.knowledgePath}/documents/${encodeURIComponent(id)}`,
        { timeout: 10_000 }
      );
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: 'Cannot delete document.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async retrieve(query: string, conversationId: string) {
    return ragEngine.retrieve({ query, conversationId });
  }
}

export const knowledgeService = new KnowledgeService();
