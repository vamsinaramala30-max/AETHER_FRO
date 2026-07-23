import React, { Suspense } from 'react';
import { Lights } from './Lights';
import { Camera } from './Camera';
import { Controls } from './Controls';
import { Background } from './Background';
import { Loader } from './Loader';

export interface SceneProps {
  children?: React.ReactNode;
  showControls?: boolean;
}

export const Scene: React.FC<SceneProps> = ({ children, showControls = true }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Background />
      <Camera />
      <Lights />
      {showControls && <Controls />}
      {children}
    </Suspense>
  );
};