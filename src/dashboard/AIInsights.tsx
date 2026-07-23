import React from 'react';

interface InsightNode {
  id: string;
  confidence: number;
  message: string;
  domain: string;
}

interface AIInsightsProps {
  insights?: InsightNode[];
  isProcessing?: boolean;
  isServiceAvailable?: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights = [], isProcessing, isServiceAvailable = true }) => {
  if (isProcessing) return <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-full" />;

  return (
    <div className="p-6 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50/40 to-white/70 dark:from-indigo-950/20 dark:to-slate-900/70 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Aether AI Core</span>
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </h3>
        <span className="text-2xs font-mono bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
          {isServiceAvailable ? 'Online' : 'Offline'}
        </span>
      </div>

      {!isServiceAvailable ? (
        <p className="text-sm text-slate-400 italic">Cognitive deduction subsystem suspended.</p>
      ) : insights.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Awaiting pipeline analysis matrix telemetry...</p>
      ) : (
        <div className="space-y-3">
          {insights.map((ins) => (
            <div key={ins.id} className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/50 border border-slate-100 dark:border-indigo-950/40 text-sm">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-2xs font-bold text-indigo-500 uppercase tracking-wide">{ins.domain}</span>
                <span className="text-3xs font-mono text-slate-400">conf: {(ins.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-normal font-medium">{ins.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;