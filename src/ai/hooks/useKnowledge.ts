// ============================================================================
// AETHER AI — useKnowledge Hook
// ============================================================================

import { useCallback, useEffect } from 'react';
import { useAIStore } from '../ai-store';
import { knowledgeService } from '../services/knowledge-service';
import type { AIDocument, RAGStatus } from '../ai-types';

export interface UseKnowledgeReturn {
  documents: AIDocument[];
  ragStatus: RAGStatus | null;
  isUploading: boolean;

  refresh: () => Promise<void>;
  uploadDocument: (file: File, collectionId?: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

/**
 * useKnowledge — knowledge base documents and RAG status hook.
 */
export function useKnowledge(): UseKnowledgeReturn {
  const documents = useAIStore((s) => s.documents);
  const ragStatus = useAIStore((s) => s.ragStatus);

  const setRAGStatus = useAIStore((s) => s.setRAGStatus);
  const setDocuments = useAIStore((s) => s.setDocuments);
  const upsertDocument = useAIStore((s) => s.upsertDocument);
  const removeDocument = useAIStore((s) => s.removeDocument);
  const setError = useAIStore((s) => s.setError);

  const isUploading = documents.some(
    (d) => d.status === 'parsing' || d.status === 'chunking' || d.status === 'embedding',
  );

  const refresh = useCallback(async () => {
    const [statusResult, docsResult] = await Promise.all([
      knowledgeService.getStatus(),
      knowledgeService.listDocuments(),
    ]);
    if (statusResult.success) setRAGStatus(statusResult.data);
    if (docsResult.success) setDocuments(docsResult.data);
    if (!statusResult.success) setError(statusResult.error);
    if (!docsResult.success) setError(docsResult.error);
  }, [setRAGStatus, setDocuments, setError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const uploadDocument = useCallback(
    async (file: File, collectionId?: string) => {
      const result = await knowledgeService.uploadDocument(file, collectionId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      upsertDocument(result.data);
    },
    [upsertDocument, setError],
  );

  const deleteDocument = useCallback(
    async (id: string) => {
      const result = await knowledgeService.deleteDocument(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      removeDocument(id);
    },
    [removeDocument, setError],
  );

  return {
    documents,
    ragStatus,
    isUploading,
    refresh,
    uploadDocument,
    deleteDocument,
  };
}
