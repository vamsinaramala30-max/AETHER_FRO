import { describe, it, expect } from 'vitest';
import { mockWorkflows } from '../mocks/automation.mock';

describe('Automation Test Suite', () => {
  it('should verify enabled workflows', () => {
    const enabled = mockWorkflows.filter((w) => w.enabled);
    expect(enabled.length).toBe(2);
  });
});