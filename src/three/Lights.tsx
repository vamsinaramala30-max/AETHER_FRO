import React from 'react';

export interface LightsProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
}

export const Lights: React.FC<LightsProps> = ({
  ambientIntensity = 0.5,
  directionalIntensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={directionalIntensity} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
};