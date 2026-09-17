// ============================================================================
// AETHER AI — Vector Store (Frontend Status Abstraction)
// ============================================================================
// Represents vector store state. The frontend does NOT operate a vector DB.
// All vector storage and search is managed by the AETHER backend.
// ============================================================================

/**
 * Frontend representation of a vector collection.
 */
export interface VectorCollection {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  vectorCount: number;
  embeddingModel: string;
  dimension: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Frontend representation of vector store status.
 */
export interface VectorStoreStatus {
  healthy: boolean;
  totalCollections: number;
  totalVectors: number;
  backendType: string;
  lastOperationAt?: number;
  error?: string;
}

/**
 * Normalize raw backend vector collection data.
 */
export function normalizeVectorCollection(raw: Record<string, unknown>): VectorCollection {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : '',
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Collection',
    description: typeof raw['description'] === 'string' ? raw['description'] : undefined,
    documentCount: typeof raw['document_count'] === 'number' ? raw['document_count'] : 0,
    vectorCount: typeof raw['vector_count'] === 'number' ? raw['vector_count'] : 0,
    embeddingModel: typeof raw['embedding_model'] === 'string' ? raw['embedding_model'] : 'unknown',
    dimension: typeof raw['dimension'] === 'number' ? raw['dimension'] : 0,
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
  };
}

/**
 * Normalize raw backend vector store status.
 */
export function normalizeVectorStoreStatus(raw: Record<string, unknown>): VectorStoreStatus {
  return {
    healthy: raw['healthy'] === true,
    totalCollections: typeof raw['total_collections'] === 'number' ? raw['total_collections'] : 0,
    totalVectors: typeof raw['total_vectors'] === 'number' ? raw['total_vectors'] : 0,
    backendType: typeof raw['backend_type'] === 'string' ? raw['backend_type'] : 'unknown',
    lastOperationAt:
      typeof raw['last_operation_at'] === 'number' ? raw['last_operation_at'] : undefined,
    error: typeof raw['error'] === 'string' ? raw['error'] : undefined,
  };
}

export const vectorStore = {
  normalizeVectorCollection,
  normalizeVectorStoreStatus,
};
