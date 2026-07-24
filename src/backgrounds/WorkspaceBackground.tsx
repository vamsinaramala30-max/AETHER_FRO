import React from "react";
import { AuroraGradient } from "../components/background/AuroraGradient";

export const WorkspaceBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-[#050816] overflow-hidden pointer-events-none">
      <AuroraGradient primary="#EC4899" secondary="#7C3AED" />
    </div>
  );
};