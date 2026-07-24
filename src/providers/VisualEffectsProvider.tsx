import React, { createContext, useContext, useEffect, useState } from "react";

interface VisualEffectsContextType {
  isLowPower: boolean;
  reducedMotion: boolean;
  enable3D: boolean;
  setEnable3D: (value: boolean) => void;
}

const VisualEffectsContext = createContext<VisualEffectsContextType>({
  isLowPower: false,
  reducedMotion: false,
  enable3D: true,
  setEnable3D: () => {},
});

export const VisualEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enable3D, setEnable3D] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Detect reduced motion preferences
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    // Hardware concurrency / Mobile low-power check
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      setIsLowPower(true);
    }

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  return (
    <VisualEffectsContext.Provider value={{ isLowPower, reducedMotion, enable3D, setEnable3D }}>
      {children}
    </VisualEffectsContext.Provider>
  );
};

export const useVisualEffects = () => useContext(VisualEffectsContext);