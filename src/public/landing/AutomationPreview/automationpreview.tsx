import React from 'react';

export const AutomationPreview: React.FC = () => {
  return (
    <section className="py-20 border-b border-zinc-900" aria-labelledby="automation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 id="automation-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            Advanced Workflows & Custom Automation Vision
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Our platform framework outlines a pipeline roadmap where recurring tasks, script executions, and API data polling flow smoothly across private endpoints. 
          </p>
          
          <div className="mt-8 inline-block bg-zinc-950 border border-amber-950/40 text-amber-200/90 px-4 py-2 rounded text-xs font-mono max-w-xl text-left">
            <strong>Product Specification Clarification:</strong> Full cross-application background triggers are part of our future architecture roadmap. Currently, active processes remain entirely explicitly triggered by the user to ensure deterministic safety.
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 border border-zinc-800 bg-zinc-900/20 rounded">
              <span className="text-zinc-500 text-xs font-mono block mb-2">PHASE I // NOW</span>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium">Explicit Execution</p>
              <p className="text-xs text-zinc-500 mt-1">Actions operate purely via clear user execution commands.</p>
            </div>
            <div className="p-4 border border-zinc-900 bg-zinc-950 rounded">
              <span className="text-zinc-600 text-xs font-mono block mb-2">PHASE II // DEVELOPMENT</span>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">Local API Polling</p>
              <p className="text-xs text-zinc-600 mt-1">Connectivity hooks optimized for local application integration loops.</p>
            </div>
            <div className="p-4 border border-zinc-900 bg-zinc-950 rounded">
              <span className="text-zinc-600 text-xs font-mono block mb-2">PHASE III // VISION</span>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">Autonomous Triggers</p>
              <p className="text-xs text-zinc-600 mt-1">Safe event-driven architectures running securely within isolated tasks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};