import { useState, useCallback } from 'react';

export interface SceneState {
  loaded: boolean;
  error: Error | null;
  activeObject: string | null;
}

export const useThreeScene = () => {
  const [state, setState] = useState<SceneState>({
    loaded: false,
    error: null,
    activeObject: null,
  });

  const setLoaded = useCallback((loaded: boolean) => {
    setState((prev) => ({ ...prev, loaded }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setActiveObject = useCallback((activeObject: string | null) => {
    setState((prev) => ({ ...prev, activeObject }));
  }, []);

  return {
    ...state,
    setLoaded,
    setError,
    setActiveObject,
  };
};
