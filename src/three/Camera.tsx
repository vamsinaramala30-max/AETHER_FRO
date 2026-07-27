import React from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { THREE_DEFAULTS } from './constants';

export interface CameraProps {
  fov?: number;
  position?: [number, number, number];
  makeDefault?: boolean;
}

export const Camera: React.FC<CameraProps> = ({
  fov = THREE_DEFAULTS.camera.fov,
  position = THREE_DEFAULTS.camera.position,
  makeDefault = true,
}) => {
  return (
    <PerspectiveCamera
      makeDefault={makeDefault}
      fov={fov}
      position={position}
      near={THREE_DEFAULTS.camera.near}
      far={THREE_DEFAULTS.camera.far}
    />
  );
};
