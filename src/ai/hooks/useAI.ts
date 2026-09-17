// ============================================================================
// AETHER AI — useAI Hook (Unified AI State and Actions)
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useAIStore } from '../ai-store';
import { aiService } from '../services/ai-service';
import { modelService } from '../services/model-service';
import type {
  AIConnectionStatus,
  AIError,
  AIModelInfo,
  StreamingStatus,
  ThinkingState,
  AIPanel,
  AIProviderMode,
  FallbackNotice,
  ProviderStatusInfo,
} from '../ai-types';

export interface UseAIReturn {
  // State
  connectionStatus: AIConnectionStatus;
  activeModel: AIModelInfo | null;
  streamingStatus: StreamingStatus;
  thinkingState: ThinkingState | null;
  error: AIError | null;
  sidebarOpen: boolean;
  activePanel: AIPanel;
  isStreaming: boolean;
  isAvailable: boolean;

  // Provider State
  providerMode: AIProviderMode;
  activeProvider: string;
  fallbackNotice: FallbackNotice | null;
  providerStatuses: Record<string, ProviderStatusInfo>;

  // Actions
  clearError: () => void;
  stopGeneration: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActivePanel: (panel: AIPanel) => void;
  setProviderMode: (mode: AIProviderMode) => void;
  checkHealth: () => Promise<void>;
}

/**
 * useAI — Unified hook for global AI state and top-level actions.
 */
export function useAI(): UseAIReturn {
  const connectionStatus = useAIStore((s) => s.connectionStatus);
  const activeModel = useAIStore((s) => s.activeModel);
  const streamingStatus = useAIStore((s) => s.streamingStatus);
  const thinkingState = useAIStore((s) => s.thinkingState);
  const error = useAIStore((s) => s.error);
  const sidebarOpen = useAIStore((s) => s.sidebarOpen);
  const activePanel = useAIStore((s) => s.activePanel);

  const providerMode = useAIStore((s) => s.providerMode);
  const activeProvider = useAIStore((s) => s.activeProvider);
  const fallbackNotice = useAIStore((s) => s.fallbackNotice);
  const providerStatuses = useAIStore((s) => s.providerStatuses);

  const setConnectionStatus = useAIStore((s) => s.setConnectionStatus);
  const clearError = useAIStore((s) => s.clearError);
  const setSidebarOpen = useAIStore((s) => s.setSidebarOpen);
  const toggleSidebar = useAIStore((s) => s.toggleSidebar);
  const setActivePanel = useAIStore((s) => s.setActivePanel);
  const setProviderMode = useAIStore((s) => s.setProviderMode);

  const healthCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkHealth = useCallback(async () => {
    setConnectionStatus('connecting');
    const healthy = await aiService.checkHealth();
    setConnectionStatus(healthy ? 'connected' : 'unavailable');
  }, [setConnectionStatus]);

  const stopGeneration = useCallback(() => {
    aiService.stopStreaming();
  }, []);

  // Initial health check, model discovery, and periodic polling
  useEffect(() => {
    void checkHealth();

    if (!useAIStore.getState().activeModel) {
      void modelService.listModels().then((result) => {
        if (result.success && result.data.length > 0) {
          useAIStore.getState().setAvailableModels(result.data);
          const best = modelService.selectBestModel(result.data);
          if (best) {
            useAIStore.getState().setActiveModel(best);
            useAIStore.getState().setModelStatus(best.status);
          }
        }
      });
    }

    healthCheckRef.current = setInterval(() => {
      void checkHealth();
    }, 60_000);
    return () => {
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
    };
  }, [checkHealth]);

  return {
    connectionStatus,
    activeModel,
    streamingStatus,
    thinkingState,
    error,
    sidebarOpen,
    activePanel,
    isStreaming: streamingStatus === 'streaming' || streamingStatus === 'starting',
    isAvailable: connectionStatus === 'connected',
    providerMode,
    activeProvider,
    fallbackNotice,
    providerStatuses,
    clearError,
    stopGeneration,
    setSidebarOpen,
    toggleSidebar,
    setActivePanel,
    setProviderMode,
    checkHealth,
  };
}
