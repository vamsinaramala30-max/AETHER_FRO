import React from 'react';
import { AuroraGradient } from '../components/background/AuroraGradient';

export const WorkspaceBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050816]">
      <AuroraGradient primary="#EC4899" secondary="#7C3AED" />
    </div>
  );
};
