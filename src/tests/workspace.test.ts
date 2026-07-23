import { describe, it, expect } from 'vitest';
import { mockWorkspace } from '../mocks/workspace.mock';

describe('Workspace Test Suite', () => {
  it('should reflect enterprise plan', () => {
    expect(mockWorkspace.plan).toBe('enterprise');
  });
});