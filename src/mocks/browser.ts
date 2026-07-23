import { mockApiEndpoints } from './handlers';

export const setupBrowserMocks = () => {
  if (typeof window === 'undefined') return;
  (window as unknown as { __AETHER_MOCKS__: typeof mockApiEndpoints }).__AETHER_MOCKS__ = mockApiEndpoints;
};