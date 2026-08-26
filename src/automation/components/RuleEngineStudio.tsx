import React, { useEffect, useState } from 'react';
import { SimulatedClock } from './SimulatedClock';
import { ActiveRulesPanel } from './ActiveRulesPanel';
import { AutomationAuditLogView } from './AutomationAuditLogView';
import { PendingProposalsCard } from './PendingProposalsCard';
import { BriefCards } from './BriefCards';
import { ConfidenceModal } from './ConfidenceModal';
import { NaturalLanguageIntake } from './NaturalLanguageIntake';
import { Tier2IntegrationDoc } from './Tier2IntegrationDoc';
import { ruleEngine } from '../engine/RuleEngine';
import { ApplicationState, TaskBlock } from '../engine/types';
import { CheckCircle2, Clock, Calendar, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDecTime(decHour: number): string {
  const hr = Math.floor(decHour);
  const min = Math.round((decHour % 1) * 60);
  return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export const RuleEngineStudio: React.FC = () => {
  const [appState, setAppState] = useState<ApplicationState>(ruleEngine.getState());
  const [selectedTaskForConfidence, setSelectedTaskForConfidence] = useState<TaskBlock | null>(null);

  useEffect(() => {
    return ruleEngine.subscribe((state) => {
      setAppState(state);
    });
  }, []);

  const todayDateKey = appState.simulatedDate;
  const todaySchedule = appState.daysSchedule[todayDateKey] || { sleepStart: 23, sleepEnd: 7, blocks: [] };
  const blocks = todaySchedule.blocks;

  const handleQuickComplete = (task: TaskBlock) => {
    if (task.bucket === 'study') {
      setSelectedTaskForConfidence(task);
    } else {
      ruleEngine.completeTaskWithConfidence(task.id, 5);
    }
  };

  const getBlockPosition = (startDec: number, durationMins: number) => {
    const leftPercent = (startDec / 24) * 100;
    const widthPercent = (durationMins / (24 * 60)) * 100;
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const simTimePointerLeft = `${(appState.simulatedTime / 24) * 100}%`;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Simulated Clock Top Control Bar */}
      <SimulatedClock />

      {/* 2. Pending Proposals Banner */}
      <PendingProposalsCard />

      {/* 3. Daily Briefing Cards Banner */}
      <BriefCards />

      {/* Critical Weak Topics Alert Banner */}
      {appState.criticalSubjects.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <span className="font-extrabold">🔴 Critical Weak Topics Tracked: </span>
            <span className="font-bold">{appState.criticalSubjects.join(', ')}</span>
            <span className="ml-2 text-slate-500 dark:text-slate-400">
              (Flagged by Confidence-Driven Revision rule)
            </span>
          </div>
        </div>
      )}

      {/* 4. Live Dial & Timeline Schedule Instrument */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Calendar className="h-5 w-5 text-amber-500" />
              Interactive 24-Hour Schedule Instrument ({todayDateKey})
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Visualizes real-time session execution, 1-4-7 auto-chaining, and simulated clock pointer movement.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Active/Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Missed
            </span>
          </div>
        </div>

        {/* 24-Hour Visual Timeline */}
        <div className="relative pt-6 pb-2">
          {/* Simulated Time Pointer */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 transition-all duration-300 pointer-events-none"
            style={{ left: simTimePointerLeft }}
          >
            <div className="absolute -top-6 -translate-x-1/2 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
              {formatDecTime(appState.simulatedTime)}
            </div>
          </div>

          {/* Hour Markers Track */}
          <div className="relative h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 overflow-hidden border border-slate-200/80 dark:border-slate-800">
            {[0, 3, 6, 9, 12, 15, 18, 21].map((hr) => (
              <div
                key={hr}
                className="absolute top-0 bottom-0 border-l border-slate-300/40 dark:border-slate-700/40 pl-1 pt-1 text-[9px] font-bold text-slate-400"
                style={{ left: `${(hr / 24) * 100}%` }}
              >
                {hr.toString().padStart(2, '0')}:00
              </div>
            ))}

            {/* Blocks on Timeline */}
            {blocks.map((block) => {
              const pos = getBlockPosition(block.start, block.duration);
              const isMissed =
                !block.completed &&
                !block.missed &&
                appState.simulatedTime > block.start + block.duration / 60;

              const bgClass = block.completed
                ? 'bg-emerald-500/80 text-white'
                : isMissed
                ? 'bg-rose-500/80 text-white animate-pulse'
                : block.kind === 'fixed'
                ? 'bg-purple-600/80 text-white'
                : 'bg-amber-500/80 text-white';

              return (
                <div
                  key={block.id}
                  style={pos}
                  title={`${block.label} (${formatDecTime(block.start)} - ${formatDecTime(block.start + block.duration / 60)})`}
                  className={`absolute top-1 bottom-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold truncate transition-all ${bgClass} shadow-sm z-10`}
                >
                  {block.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {blocks.map((block) => {
            const blockEndTime = block.start + block.duration / 60;
            const isPastEnd = appState.simulatedTime > blockEndTime;
            const isMissed = !block.completed && isPastEnd;

            return (
              <div
                key={block.id}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                  block.completed
                    ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                    : isMissed
                    ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10'
                    : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {formatDecTime(block.start)} - {formatDecTime(blockEndTime)} ({block.duration}m)
                    </span>

                    <div className="flex items-center gap-1.5">
                      {block.revision && (
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 dark:text-purple-300">
                          Stage {block.revision.stage} Spaced Rep
                        </span>
                      )}
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-extrabold ${
                          block.kind === 'fixed'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}
                      >
                        {block.kind}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {block.label}
                  </h4>

                  {block.subject && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subject: <strong className="text-slate-700 dark:text-slate-200">{block.subject}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 mt-3">
                  <div className="text-xs">
                    {block.completed ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Completed
                        {block.confidence ? ` (Conf: ${block.confidence}/5)` : ''}
                      </span>
                    ) : isMissed ? (
                      <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="h-4 w-4" /> Missed Session
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-slate-500">
                        <Clock className="h-4 w-4 text-amber-500" /> Pending
                      </span>
                    )}
                  </div>

                  {!block.completed && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickComplete(block)}
                      className="h-8 bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs"
                    >
                      Complete Session
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Natural Language Command Intake */}
      <NaturalLanguageIntake />

      {/* 6. Active Rules Panel & Audit Log Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveRulesPanel />
        <AutomationAuditLogView />
      </div>

      {/* 7. Tier-2 Backend Architecture Integration Doc */}
      <Tier2IntegrationDoc />

      {/* Confidence Modal Prompt */}
      <ConfidenceModal
        task={selectedTaskForConfidence}
        isOpen={Boolean(selectedTaskForConfidence)}
        onClose={() => setSelectedTaskForConfidence(null)}
      />
    </div>
  );
};
