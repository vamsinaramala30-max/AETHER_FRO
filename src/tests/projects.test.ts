import { describe, it, expect } from 'vitest';
import { mockProjects } from '../mocks/projects.mock';

describe('Projects Test Suite', () => {
  it('should filter active projects', () => {
    const active = mockProjects.filter((p) => p.status === 'active');
    expect(active.length).toBe(2);
  });
});
