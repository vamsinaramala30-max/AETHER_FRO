import { describe, it, expect } from 'vitest';
import { mockKnowledgeDocs } from '../mocks/knowledge.mock';

describe('Knowledge Base Test Suite', () => {
  it('should contain documentation items', () => {
    expect(mockKnowledgeDocs.some((doc) => doc.type === 'pdf')).toBe(true);
  });
});
