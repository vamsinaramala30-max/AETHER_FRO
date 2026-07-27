import React from 'react';
import { THREE_DEFAULTS } from './constants';

export interface DefaultMeshModelProps {
  color?: string;
}

export const DefaultMeshModel: React.FC<DefaultMeshModelProps> = ({
  color = THREE_DEFAULTS.colors.primary,
}) => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
