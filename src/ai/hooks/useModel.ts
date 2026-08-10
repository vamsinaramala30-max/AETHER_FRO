// ============================================================================
// AETHER AI — useModel Hook
// ============================================================================

import { useCallback, useEffect } from 'react';
import { useAIStore } from '../ai-store';
import { modelService } from '../services/model-service';
import type { AIModelInfo, ModelStatus } from '../ai-types';

export interface UseModelReturn {
  availableModels: AIModelInfo[];
  activeModel: AIModelInfo | null;
  modelStatus: ModelStatus;
  isLoading: boolean;

  loadModels: () => Promise<void>;
  setActiveModel: (model: AIModelInfo) => void;
  requestLoadModel: (id: string) => Promise<void>;
  requestUnloadModel: (id: string) => Promise<void>;
}

/**
 * useModel — model state and actions hook.
 */
export function useModel(): UseModelReturn {
  const availableModels = useAIStore((s) => s.availableModels);
  const activeModel = useAIStore((s) => s.activeModel);
  const modelStatus = useAIStore((s) => s.modelStatus);

  const setAvailableModels = useAIStore((s) => s.setAvailableModels);
  const setActiveModelStore = useAIStore((s) => s.setActiveModel);
  const setModelStatus = useAIStore((s) => s.setModelStatus);
  const setError = useAIStore((s) => s.setError);

  const isLoading = modelStatus === 'loading';

  const loadModels = useCallback(async () => {
    setModelStatus('loading');
    const result = await modelService.listModels();
    if (!result.success) {
      setError(result.error);
      setModelStatus('unavailable');
      return;
    }
    setAvailableModels(result.data);
    // Auto-select if none active
    const best = modelService.selectBestModel(result.data);
    if (best) {
      setActiveModelStore(best);
      setModelStatus(best.status);
    } else {
      setModelStatus('unavailable');
    }
  }, [setAvailableModels, setActiveModelStore, setModelStatus, setError]);

  useEffect(() => {
    void loadModels();
  }, [loadModels]);

  const setActiveModel = useCallback(
    (model: AIModelInfo) => {
      setActiveModelStore(model);
      setModelStatus(model.status);
    },
    [setActiveModelStore, setModelStatus],
  );

  const requestLoadModel = useCallback(
    async (id: string) => {
      setModelStatus('loading');
      const result = await modelService.loadModel(id);
      if (!result.success) {
        setError(result.error);
        setModelStatus('error');
        return;
      }
      setActiveModelStore(result.data);
      setModelStatus(result.data.status);
      // Refresh models list
      await loadModels();
    },
    [setActiveModelStore, setModelStatus, setError, loadModels],
  );

  const requestUnloadModel = useCallback(
    async (id: string) => {
      const result = await modelService.unloadModel(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      await loadModels();
    },
    [setError, loadModels],
  );

  return {
    availableModels,
    activeModel,
    modelStatus,
    isLoading,
    loadModels,
    setActiveModel,
    requestLoadModel,
    requestUnloadModel,
  };
}
