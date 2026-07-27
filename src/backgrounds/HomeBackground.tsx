import React from 'react';
import { Background3D } from '../components/background/Background3D';
import { ParticleField } from '../components/background/ParticleField';
import { NeuralNetwork } from '../components/background/NeuralNetwork';
import { AuroraGradient } from '../components/background/AuroraGradient';

export const HomeBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050816]">
      <AuroraGradient primary="#7C3AED" secondary="#00E5FF" />
      <Background3D>
        <ParticleField count={1200} color="#00E5FF" speed={0.15} />
        <NeuralNetwork color="#8B5CF6" />
      </Background3D>
    </div>
  );
};
