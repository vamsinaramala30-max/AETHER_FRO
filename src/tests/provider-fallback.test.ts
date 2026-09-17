import { describe, it, expect, beforeEach } from 'vitest';
import { useAIStore } from '../ai/ai-store';

describe('Frontend AI Provider Fallback Store & Integration', () => {
  beforeEach(() => {
    useAIStore.getState().resetStore();
  });

  it('should initialize with auto providerMode and aether activeProvider', () => {
    const state = useAIStore.getState();
    expect(state.providerMode).toBe('auto');
    expect(state.activeProvider).toBe('aether');
    expect(state.fallbackNotice).toBeNull();
  });

  it('should update providerMode when setProviderMode is called', () => {
    useAIStore.getState().setProviderMode('openai');
    expect(useAIStore.getState().providerMode).toBe('openai');

    useAIStore.getState().setProviderMode('ollama');
    expect(useAIStore.getState().providerMode).toBe('ollama');
  });

  it('should store and retrieve fallback notice correctly', () => {
    const notice = {
      activeProvider: 'openai',
      usedFallback: true,
      reason: 'Gemini Rate Limited',
      timestamp: Date.now(),
    };

    useAIStore.getState().setFallbackNotice(notice);
    expect(useAIStore.getState().fallbackNotice).toEqual(notice);
  });

  it('should store provider status health checks', () => {
    const statuses = {
      gemini: { name: 'gemini' as const, status: 'available' as const },
      openai: { name: 'openai' as const, status: 'available' as const },
      ollama: { name: 'ollama' as const, status: 'unavailable' as const },
    };

    useAIStore.getState().setProviderStatuses(statuses);
    expect(useAIStore.getState().providerStatuses).toEqual(statuses);
  });
});
