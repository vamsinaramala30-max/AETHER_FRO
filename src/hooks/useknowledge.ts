import { useCallback } from 'react';
import { useKnowledgeStore } from '../state/knowledgeStore';

export const useKnowledge = () => {
  const documents = useKnowledgeStore((s) => s.documents);
  const searchQuery = useKnowledgeStore((s) => s.searchQuery);
  const isLoading = useKnowledgeStore((s) => s.isLoading);
  const error = useKnowledgeStore((s) => s.error);

  const setSearchQuery = useKnowledgeStore((s) => s.setSearchQuery);
  const removeDocument = useKnowledgeStore((s) => s.removeDocument);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery],
  );

  return { documents, searchQuery, isLoading, error, handleSearch, removeDocument };
};
