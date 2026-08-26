import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ruleEngine } from '../engine/RuleEngine';
import { ParsedIntent } from '../engine/types';

export const NaturalLanguageIntake: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [lastParsed, setLastParsed] = useState<ParsedIntent | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = ruleEngine.dispatchNaturalLanguageInput(input);
    setLastParsed(parsed);
    setInput('');
  };

  const handleQuickPreset = (text: string) => {
    setInput(text);
    const parsed = ruleEngine.dispatchNaturalLanguageInput(text);
    setLastParsed(parsed);
    setInput('');
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Terminal className="h-5 w-5 text-amber-500" />
            Natural Language Schedule Intake
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Type freeform English commands to schedule fixed blocks or complete tasks automatically via Rule Engine.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. "I have college 9 to 12 today" or "I finished DBMS"'
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 font-medium pl-4 pr-24 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs h-9 px-3"
          >
            Dispatch <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">Try quick presets:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('I have college 9 to 12 today')}
            className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-semibold dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            "I have college 9 to 12 today"
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('I finished DBMS')}
            className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-semibold dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            "I finished DBMS"
          </button>
        </div>
      </form>

      {/* Parse Feedback Banner */}
      {lastParsed && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs animate-in fade-in duration-200 space-y-1">
          <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Parsed Intent: <code className="font-mono text-xs">{lastParsed.intentType}</code>
            </span>
            <span>Confidence: {Math.round(lastParsed.confidence * 100)}%</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Raw Input: "{lastParsed.rawText}" • Generated schedule patch dispatched to Rule Engine.
          </p>
        </div>
      )}
    </div>
  );
};
