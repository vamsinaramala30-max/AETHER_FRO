// ============================================================================
// AETHER AI — Knowledge Service
// ============================================================================

import type { AIDocument, RAGStatus, AIResult } from '../ai-types';
import { ragEngine } from '../rag/rag-engine';
import { uploadDocument } from '../rag/document-parser';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { normalizeDocument } from '../rag/document-parser';

/**
 * KnowledgeService isolates all knowledge/RAG backend operations.
 */
export class KnowledgeService {
  private readonly config = DEFAULT_AI_CONFIG;

  async getStatus(): Promise<AIResult<RAGStatus>> {
    return ragEngine.getStatus();
  }

  async listDocuments(): Promise<AIResult<AIDocument[]>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.knowledgePath}/documents`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'RAG_FAILED', message: 'Failed to load documents.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((d): d is Record<string, unknown> => typeof d === 'object' && d !== null)
          .map(normalizeDocument),
      };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load documents.', timestamp: Date.now() },
      };
    }
  }

  async uploadDocument(file: File, collectionId?: string): Promise<AIResult<AIDocument>> {
    return uploadDocument({ file, collectionId });
  }

  async deleteDocument(id: string): Promise<AIResult<void>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.knowledgePath}/documents/${encodeURIComponent(id)}`;
    try {
      const res = await fetch(url, { method: 'DELETE', signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'RAG_FAILED', message: 'Failed to delete document.', timestamp: Date.now() },
        };
      }
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot delete document.', timestamp: Date.now() },
      };
    }
  }

  async retrieve(query: string, conversationId: string) {
    return ragEngine.retrieve({ query, conversationId });
  }
}

export const knowledgeService = new KnowledgeService();
