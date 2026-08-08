import React, { useState, useEffect } from 'react';
import { goalService, Goal } from './goalservice';
import { GoalCard } from './goalcard';
import { GoalForm } from './golaform';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Target } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const data = await goalService.getGoals();
      setGoals(data);
      setLoading(false);
    })();
  }, []);

  const handleUpdateProgress = (id: string, nextProgress: number) => {
    void (async () => {
      try {
        const updated = await goalService.updateGoalProgress(id, nextProgress);
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      } catch {
        alert('Error updating progress.');
      }
    })();
  };

  const handleCreateGoal = (rawGoal: Omit<Goal, 'id' | 'progress'>) => {
    void (async () => {
      try {
        const created = await goalService.createGoal({ ...rawGoal, progress: 0 });
        setGoals((prev) => [...prev, created]);
      } catch {
        alert('Error creating goal.');
      }
    })();
  };

  if (loading)
    return (
      <div className="flex h-64 w-full items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Syncing goals...
        </div>
      </div>
    );

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Target className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Macro Milestones & Goals
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              High-level structural objectives and quarterly milestone targets.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <GoalForm onSubmit={handleCreateGoal} />
        {Array.isArray(goals) && goals.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onUpdateProgress={handleUpdateProgress} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Target className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-600" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No goals created yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Define your first macro milestone above to start tracking progress.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
