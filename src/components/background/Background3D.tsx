import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useVisualEffects } from '../../providers/VisualEffectsContext';

interface Background3DProps {
  children: React.ReactNode;
}

export const Background3D: React.FC<Background3DProps> = ({ children }) => {
  const { isLowPower, reducedMotion, enable3D } = useVisualEffects();
  const [hasError, setHasError] = useState(false);

  if (!enable3D || reducedMotion || hasError) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isLowPower ? [1, 1] : [1, 2]}
        gl={{ powerPreference: 'high-performance', antialias: !isLowPower, alpha: true }}
        style={{ pointerEvents: 'none' }}
        onError={() => {
          setHasError(true);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
};
