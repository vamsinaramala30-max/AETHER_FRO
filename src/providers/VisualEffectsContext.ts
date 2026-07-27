import { createContext, useContext } from 'react';

export interface VisualEffectsContextType {
  isLowPower: boolean;
  reducedMotion: boolean;
  enable3D: boolean;
  setEnable3D: (value: boolean) => void;
}

export const VisualEffectsContext = createContext<VisualEffectsContextType>({
  isLowPower: false,
  reducedMotion: false,
  enable3D: true,
  setEnable3D: () => {},
});

export const useVisualEffects = (): VisualEffectsContextType => useContext(VisualEffectsContext);
