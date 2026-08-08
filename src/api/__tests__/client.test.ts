import { describe, it, expect, afterEach, vi } from 'vitest';
import { apiClient } from '../client';

describe('HttpClient API Client & Mobile URL Resolution', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should construct valid absolute URL when endpoint is relative', () => {
    const url = (apiClient as any).buildUrl('/dashboard');
    expect(url).toContain('/api/v1/dashboard');
  });

  it('should preserve absolute HTTP/HTTPS endpoints', () => {
    const customEndpoint = 'https://api.external.com/v1/custom';
    const url = (apiClient as any).buildUrl(customEndpoint);
    expect(url).toBe(customEndpoint);
  });

  it('should include search parameters correctly', () => {
    const url = (apiClient as any).buildUrl('/tasks', { page: 1, limit: 10, search: 'test' });
    expect(url).toContain('page=1');
    expect(url).toContain('limit=10');
    expect(url).toContain('search=test');
  });

  it('should dynamically adapt localhost backend URL when accessed from mobile network host', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, hostname: '192.168.1.50', origin: 'http://192.168.1.50:5173' },
    });

    const url = (apiClient as any).buildUrl('/dashboard');
    expect(url).toContain('192.168.1.50');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
