import React from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';

export interface EnvironmentProps {
  preset?: 'city' | 'sunset' | 'night' | 'dawn';
}

export const Environment: React.FC<EnvironmentProps> = ({ preset = 'city' }) => {
  return <DreiEnvironment preset={preset} />;
};