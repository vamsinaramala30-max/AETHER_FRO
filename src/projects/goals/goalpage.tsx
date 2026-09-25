import React, { useState, useEffect, useCallback } from 'react';
import { goalService, Goal, GoalStatus } from './goalservice';
import { GoalCard } from './goalcard';
import { GoalForm } from './golaform';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Target, AlertCircle, RefreshCw } from 'lucide-react';
import { useNotificationStore } from '@/state/notificationStore';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to sync goals from server.');
      useNotificationStore.getState().addNotification({
        title: 'Goal Sync Failed',
        description: 'Could not load project goals from the backend server.',
        type: 'project',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  const handleUpdateProgress = (id: string, nextProgress: number) => {
    void (async () => {
      try {
        const updated = await goalService.updateGoalProgress(id, nextProgress);
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
        useNotificationStore.getState().addNotification({
          title: 'Progress Updated',
          description: `Goal progress updated to ${nextProgress}%.`,
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Update Error',
          description: 'Unable to save goal progress to database.',
          type: 'project',
        });
      }
    })();
  };

  const handleStatusChange = (id: string, nextStatus: GoalStatus) => {
    void (async () => {
      try {
        const updated = await goalService.updateGoal(id, { status: nextStatus });
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
        useNotificationStore.getState().addNotification({
          title: 'Status Updated',
          description: `Goal status transitioned to ${nextStatus.replace('_', ' ')}.`,
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Status Error',
          description: 'Failed to transition goal status.',
          type: 'project',
        });
      }
    })();
  };

  const handleCreateGoal = (rawGoal: Omit<Goal, 'id' | 'progress' | 'status'>) => {
    void (async () => {
      try {
        const created = await goalService.createGoal({
          ...rawGoal,
          progress: 0,
          status: 'PLANNED',
        });
        setGoals((prev) => [created, ...prev]);
        useNotificationStore.getState().addNotification({
          title: 'Goal Established',
          description: `New goal "${created.title}" successfully committed to project.`,
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Goal Creation Error',
          description: 'Unable to establish new goal on backend.',
          type: 'project',
        });
      }
    })();
  };

  const handleDeleteGoal = (id: string) => {
    void (async () => {
      try {
        await goalService.deleteGoal(id);
        setGoals((prev) => prev.filter((g) => g.id !== id));
        useNotificationStore.getState().addNotification({
          title: 'Goal Removed',
          description: 'Goal permanently removed from project.',
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Deletion Error',
          description: 'Failed to delete goal from backend database.',
          type: 'project',
        });
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
          <Target className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
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
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => void loadGoals()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-500 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <GoalForm onSubmit={handleCreateGoal} />
        {Array.isArray(goals) && goals.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onStatusChange={handleStatusChange}
                onDeleteGoal={handleDeleteGoal}
              />
            ))}
          </div>
        ) : !error ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Target className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-600" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No goals created yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Define your first macro milestone above to start tracking progress.
            </p>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};
