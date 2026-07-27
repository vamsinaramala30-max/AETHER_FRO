import React from 'react';
import { Background3D } from '../components/background/Background3D';
import { NeuralNetwork } from '../components/background/NeuralNetwork';
import { AuroraGradient } from '../components/background/AuroraGradient';

export const ChatBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050816]">
      <AuroraGradient primary="#3B82F6" secondary="#00FFB3" />
      <Background3D>
        <NeuralNetwork color="#22D3EE" />
      </Background3D>
    </div>
  );
};
