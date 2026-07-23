import React from 'react';
import { OrbitControls } from '@react-three/drei';

export interface ControlsProps {
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  enableZoom = true,
  enablePan = true,
  autoRotate = false,
}) => {
  return (
    <OrbitControls
      enableZoom={enableZoom}
      enablePan={enablePan}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
    />
  );
};