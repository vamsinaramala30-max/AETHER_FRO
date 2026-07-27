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

export const AIInsights: React.FC<AIInsightsProps> = ({
  insights = [],
  isProcessing = false,
  isServiceAvailable = true,
}) => {
  if (isProcessing)
    return <div className="h-44 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;

  return (
    <div className="rounded-xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/40 to-white/70 p-6 backdrop-blur-md dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span>Aether AI Core</span>
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
        </h3>
        <span className="text-2xs rounded-full bg-indigo-100 px-2 py-0.5 font-mono text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
          {isServiceAvailable ? 'Online' : 'Offline'}
        </span>
      </div>

      {!isServiceAvailable ? (
        <p className="text-sm italic text-slate-400">Cognitive deduction subsystem suspended.</p>
      ) : insights.length === 0 ? (
        <p className="text-sm italic text-slate-400">
          Awaiting pipeline analysis matrix telemetry...
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="rounded-lg border border-slate-100 bg-white/80 p-3 text-sm dark:border-indigo-950/40 dark:bg-slate-900/50"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-2xs font-bold uppercase tracking-wide text-indigo-500">
                  {ins.domain}
                </span>
                <span className="text-3xs font-mono text-slate-400">
                  conf: {(ins.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="font-medium leading-normal text-slate-700 dark:text-slate-300">
                {ins.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
