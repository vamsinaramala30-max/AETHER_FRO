import React from 'react';
import { Canvas as R3FCanvas } from '@react-three/fiber';

export interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Canvas: React.FC<CanvasProps> = ({ children, className, style }) => {
  return (
    <R3FCanvas
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '300px', ...style }}
      gl={{ antialias: true, alpha: true }}
    >
      {children}
    </R3FCanvas>
  );
};
