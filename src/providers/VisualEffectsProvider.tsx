import React, { useEffect, useState } from 'react';
import { VisualEffectsContext } from './VisualEffectsContext';

export const VisualEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enable3D, setEnable3D] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Detect reduced motion preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Hardware concurrency / Mobile low-power check
    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) {
      setIsLowPower(true);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <VisualEffectsContext.Provider value={{ isLowPower, reducedMotion, enable3D, setEnable3D }}>
      {children}
    </VisualEffectsContext.Provider>
  );
};
