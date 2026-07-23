import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export const Loader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: '#00f0ff', fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 600 }}>
        {progress.toFixed(0)}% LOADED
      </div>
    </Html>
  );
};