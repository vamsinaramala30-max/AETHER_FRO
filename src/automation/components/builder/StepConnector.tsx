import React from 'react';
import { ChevronDown } from 'lucide-react';

export const StepConnector: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="h-6 w-0.5 bg-gradient-to-b from-amber-500/60 to-amber-500/20" />
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
        <ChevronDown className="h-3 w-3" />
      </div>
      <div className="h-6 w-0.5 bg-gradient-to-b from-amber-500/20 to-amber-500/60" />
    </div>
  );
};
