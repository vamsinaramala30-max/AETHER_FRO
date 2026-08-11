import { describe, it, expect } from 'vitest';
import { buildIntent, trimMessages } from '../ai/core/context-engine';
import type { AIMessage } from '../ai/ai-types';

describe('Frontend ContextEngine', () => {
  it('should detect RAG requirements in user query', () => {
    const intent = buildIntent('find in document report');
    expect(intent.requiresRAG).toBe(true);
  });

  it('should detect tool requirements in user query', () => {
    const intent = buildIntent('create task review budget');
    expect(intent.requiresTools).toBe(true);
  });

  it('should trim messages to fit token/character window preserving newest messages', () => {
    const messages: AIMessage[] = [
      { id: '1', conversationId: 'c1', role: 'user', content: 'Old message 1', status: 'delivered', createdAt: 1, updatedAt: 1 },
      { id: '2', conversationId: 'c1', role: 'assistant', content: 'Old response 1', status: 'delivered', createdAt: 2, updatedAt: 2 },
      { id: '3', conversationId: 'c1', role: 'user', content: 'Newest query', status: 'delivered', createdAt: 3, updatedAt: 3 },
    ];

    const trimmed = trimMessages(messages, 25);
    expect(trimmed.length).toBeLessThan(messages.length);
    expect(trimmed[trimmed.length - 1].content).toBe('Newest query');
  });
});
