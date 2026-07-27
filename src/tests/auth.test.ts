import { describe, it, expect } from 'vitest';
import { mockUser } from '../mocks/auth.mock';

describe('Auth Test Suite', () => {
  it('should validate mock user structure', () => {
    expect(mockUser).toHaveProperty('id');
    expect(mockUser).toHaveProperty('email');
    expect(mockUser.role).toBe('admin');
  });
});
