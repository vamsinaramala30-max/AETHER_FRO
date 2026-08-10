// ============================================================================
// AETHER AI — Document Parser (Frontend Status Abstraction)
// ============================================================================
// Represents document parsing state. Actual parsing occurs on the backend.
// ============================================================================

import type { AIDocument, DocumentStatus, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

/**
 * Frontend representation of a document upload/parse request.
 */
export interface DocumentParseRequest {
  file: File;
  collectionId?: string;
  metadata?: Record<string, string>;
}

/**
 * Normalize a raw backend document payload.
 */
export function normalizeDocument(raw: Record<string, unknown>): AIDocument {
  const validStatuses: DocumentStatus[] = ['pending', 'parsing', 'chunking', 'embedding', 'indexed', 'error'];
  const rawStatus = raw['status'] as string;
  const status: DocumentStatus = validStatuses.includes(rawStatus as DocumentStatus)
    ? (rawStatus as DocumentStatus)
    : 'pending';

  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `doc_${Date.now()}`,
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Document',
    type: typeof raw['type'] === 'string' ? raw['type'] : 'application/octet-stream',
    size: typeof raw['size'] === 'number' ? raw['size'] : 0,
    status,
    chunkCount: typeof raw['chunk_count'] === 'number' ? raw['chunk_count'] : undefined,
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    error: typeof raw['error'] === 'string' ? raw['error'] : undefined,
    collectionId: typeof raw['collection_id'] === 'string' ? raw['collection_id'] : undefined,
  };
}

/**
 * Upload a document to the AETHER backend for parsing and indexing.
 */
export async function uploadDocument(
  request: DocumentParseRequest,
): Promise<AIResult<AIDocument>> {
  const url = `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.knowledgePath}/documents`;
  try {
    const formData = new FormData();
    formData.append('file', request.file);
    if (request.collectionId) formData.append('collection_id', request.collectionId);
    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata));
    }

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(120_000), // 2 min for large files
    });

    if (!res.ok) {
      return {
        success: false,
        error: {
          code: 'RAG_FAILED',
          message: `Document upload failed: HTTP ${res.status}`,
          timestamp: Date.now(),
        },
      };
    }

    const raw = await res.json() as Record<string, unknown>;
    return { success: true, data: normalizeDocument(raw) };
  } catch {
    return {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Cannot upload document to the AETHER backend.',
        timestamp: Date.now(),
      },
    };
  }
}

/**
 * Get the status label for a document.
 */
export function getDocumentStatusLabel(status: DocumentStatus): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'parsing': return 'Parsing…';
    case 'chunking': return 'Chunking…';
    case 'embedding': return 'Embedding…';
    case 'indexed': return 'Indexed';
    case 'error': return 'Error';
    default: return 'Unknown';
  }
}

export const documentParser = {
  normalizeDocument,
  uploadDocument,
  getDocumentStatusLabel,
};
