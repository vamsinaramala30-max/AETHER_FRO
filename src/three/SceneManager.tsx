import React from 'react';
import { Canvas } from './Canvas';
import { Scene } from './scene';
import { Particles } from './Particles';
import { DefaultMeshModel } from './Models';

export interface SceneManagerProps {
  showParticles?: boolean;
  children?: React.ReactNode;
}

export const SceneManager: React.FC<SceneManagerProps> = ({
  showParticles = true,
  children,
}) => {
  return (
    <Canvas>
      <Scene>
        {showParticles && <Particles />}
        {children || <DefaultMeshModel />}
      </Scene>
    </Canvas>
  );
};