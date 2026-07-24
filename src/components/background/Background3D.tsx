import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useVisualEffects } from "../../providers/VisualEffectsProvider";

interface Background3DProps {
  children: React.ReactNode;
}

export const Background3D: React.FC<Background3DProps> = ({ children }) => {
  const { isLowPower, reducedMotion, enable3D } = useVisualEffects();

  if (!enable3D || reducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isLowPower ? [1, 1] : [1, 2]}
        gl={{ powerPreference: "high-performance", antialias: !isLowPower, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};