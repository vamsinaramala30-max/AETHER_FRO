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
  const validStatuses: DocumentStatus[] = [
    'pending',
    'parsing',
    'chunking',
    'embedding',
    'indexed',
    'error',
  ];
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

import { apiClient } from '../../api/client';

/**
 * Upload a document to the AETHER backend for parsing and indexing.
 */
export async function uploadDocument(request: DocumentParseRequest): Promise<AIResult<AIDocument>> {
  try {
    const formData = new FormData();
    formData.append('file', request.file);
    if (request.collectionId) formData.append('collection_id', request.collectionId);
    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata));
    }

    const res = await apiClient.post<Record<string, unknown> | { success?: boolean; data?: Record<string, unknown> }>(
      `${DEFAULT_AI_CONFIG.backend.knowledgePath}/documents`,
      formData,
      { timeout: 120_000 }
    );

    const payload = (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object')
      ? (res.data as Record<string, unknown>)
      : (res as Record<string, unknown>);

    return { success: true, data: normalizeDocument(payload) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot upload document to the AETHER backend.';
    return {
      success: false,
      error: {
        code: 'RAG_FAILED',
        message,
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
    case 'pending':
      return 'Pending';
    case 'parsing':
      return 'Parsing…';
    case 'chunking':
      return 'Chunking…';
    case 'embedding':
      return 'Embedding…';
    case 'indexed':
      return 'Indexed';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}

export const documentParser = {
  normalizeDocument,
  uploadDocument,
  getDocumentStatusLabel,
};
