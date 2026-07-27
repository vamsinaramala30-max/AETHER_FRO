import { describe, it, expect } from 'vitest';
import { mockAiMessages } from '../mocks/ai.mock';

describe('AI Test Suite', () => {
  it('should load mock AI conversations correctly', () => {
    expect(mockAiMessages.length).toBeGreaterThan(0);
    expect(mockAiMessages[0].role).toBe('system');
  });
});
