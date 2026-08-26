import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle2, AlertTriangle, Clock, Activity, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { ruleEngine } from '../engine/RuleEngine';
import { Rule } from '../engine/types';

export const ActiveRulesPanel: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>(ruleEngine.getRules());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    return ruleEngine.subscribe(() => {
      setRules(ruleEngine.getRules());
    });
  }, []);

  const handleToggle = (id: string, current: boolean) => {
    ruleEngine.toggleRule(id, !current);
    setRules(ruleEngine.getRules());
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Spaced Repetition':
        return 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20';
      case 'Schedule Rebuild':
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20';
      case 'Reminders':
        return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20';
      case 'Daily Briefs':
        return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20';
      case 'Knowledge':
        return 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Zap className="h-5 w-5 text-amber-500" />
            Active Automation Rules
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Declarative event-driven rules evaluating against application state & returning non-mutating state patches.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          {rules.filter((r) => r.isEnabled).length} / {rules.length} Enabled
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {rules.map((rule) => {
          const isExpanded = expandedId === rule.id;
          return (
            <div
              key={rule.id}
              className={`rounded-xl border transition-all ${
                rule.isEnabled
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60'
                  : 'border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/40 dark:bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(rule.id, rule.isEnabled)}
                    className={`mt-0.5 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.isEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rule.name}</h4>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getCategoryColor(rule.category)}`}>
                        {rule.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rule.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-[11px] font-semibold text-slate-400">
                    <span className="block text-slate-700 dark:text-slate-300 font-bold">{rule.runCount} runs</span>
                    <span>{rule.lastRunAt ? `Last: ${rule.lastRunAt}` : 'Never run'}</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-xs dark:border-slate-800/80 dark:bg-slate-950/50 rounded-b-xl space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Trigger:</span>
                    <code className="rounded bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                      {rule.trigger}
                    </code>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mt-0.5">Execution:</span>
                    <span>Evaluates state conditions & creates atomic Patch objects recorded to Automation Audit Log.</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
