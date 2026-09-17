import { describe, it, expect } from 'vitest';
import {
  normalizeGenerationResponse,
  generationResponseToMessage,
} from '../ai/core/response-engine';

describe('Frontend ResponseEngine', () => {
  it('should normalize raw backend response correctly', () => {
    const raw = {
      message_id: 'msg_100',
      content: 'Here is your response.',
      confidence: 'HIGH_CONFIDENCE',
      citations: [{ id: 'cit_1', title: 'Doc A', score: 0.9 }],
    };

    const res = normalizeGenerationResponse(raw, 'conv_1');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.messageId).toBe('msg_100');
      expect(res.data.confidence).toBe('HIGH_CONFIDENCE');
      expect(res.data.citations?.length).toBe(1);
    }
  });

  it('should convert GenerationResponse to AIMessage', () => {
    const genRes = {
      messageId: 'msg_101',
      conversationId: 'conv_1',
      content: 'Sample content',
      role: 'assistant' as const,
      confidence: 'HIGH_CONFIDENCE' as const,
      generatedAt: Date.now(),
    };

    const msg = generationResponseToMessage(genRes);
    expect(msg.id).toBe('msg_101');
    expect(msg.confidence).toBe('HIGH_CONFIDENCE');
    expect(msg.role).toBe('assistant');
  });
});
