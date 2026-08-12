import { describe, it, expect, vi } from 'vitest';
import { mockKnowledgeDocs } from '../mocks/knowledge.mock';
import { notesService } from '../knowledge/notes/noteservice';
import { apiClient } from '@/api/client';

describe('Knowledge Base & Notes Test Suite', () => {
  it('should contain documentation items', () => {
    expect(mockKnowledgeDocs.some((doc) => doc.type === 'pdf')).toBe(true);
  });

  it('should propagate error on failed note deletion and not hide note', async () => {
    vi.spyOn(apiClient, 'delete').mockRejectedValueOnce(new Error('Backend error'));
    await expect(notesService.deleteNote('invalid-id')).rejects.toThrow('Backend error');
  });
});
