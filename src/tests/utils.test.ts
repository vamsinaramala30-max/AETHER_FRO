import { describe, it, expect } from 'vitest';

describe('Utility Function Test Suite', () => {
  it('should format strings cleanly', () => {
    const text = ' aether ';
    expect(text.trim()).toBe('aether');
  });
});
