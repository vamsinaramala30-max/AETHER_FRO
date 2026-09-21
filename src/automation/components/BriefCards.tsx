import React, { useEffect, useState } from 'react';
import { Sun, Moon, Sparkles, CheckCircle2, X, Clock, Flame } from 'lucide-react';
import { ruleEngine } from '../engine/RuleEngine';
import { BriefData } from '../engine/types';

export const BriefCards: React.FC = () => {
  const [briefs, setBriefs] = useState<BriefData[]>(
    ruleEngine.getState().activeBriefs.filter((b) => !b.dismissed)
  );

  useEffect(() => {
    return ruleEngine.subscribe((state) => {
      setBriefs(state.activeBriefs.filter((b) => !b.dismissed));
    });
  }, []);

  if (briefs.length === 0) return null;

  return (
    <div className="space-y-4">
      {briefs.map((brief) => {
        const isMorning = brief.type === 'morning';
        const isEvening = brief.type === 'evening';

        const gradientClass = isMorning
          ? 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30'
          : isEvening
          ? 'from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/30'
          : 'from-blue-500/10 via-slate-500/5 to-transparent border-blue-500/30';

        const icon = isMorning ? (
          <Sun className="h-6 w-6 text-amber-500" />
        ) : isEvening ? (
          <Flame className="h-6 w-6 text-purple-500" />
        ) : (
          <Moon className="h-6 w-6 text-blue-500" />
        );

        return (
          <div
            key={brief.id}
            className={`relative rounded-2xl border bg-gradient-to-r ${gradientClass} p-5 shadow-sm backdrop-blur-md animate-in fade-in duration-300`}
          >
            <button
              onClick={() => ruleEngine.dismissBrief(brief.id)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
                {icon}
              </div>

              <div className="space-y-3 flex-1 pr-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Simulated Briefing • {brief.dateKey}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{brief.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">{brief.subtitle}</p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {brief.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
