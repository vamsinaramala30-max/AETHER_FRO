import { goalsApi } from '../../api/goals.api';

export type GoalStatus = 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'ARCHIVED';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'career' | 'personal' | string;
  metrics?: string;
  projectId?: string;
}

const mapStatusToApi = (
  status?: GoalStatus,
): 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | undefined => {
  if (!status) return undefined;
  switch (status) {
    case 'PLANNED':
      return 'NOT_STARTED';
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'AT_RISK':
      return 'AT_RISK';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'ARCHIVED':
      return 'CANCELLED';
  }
};

const mapStatusFromApi = (status?: string): GoalStatus => {
  if (!status) return 'PLANNED';
  const s = status.toUpperCase();
  if (s === 'NOT_STARTED' || s === 'PLANNED') return 'PLANNED';
  if (s === 'IN_PROGRESS') return 'IN_PROGRESS';
  if (s === 'AT_RISK') return 'AT_RISK';
  if (s === 'COMPLETED' || s === 'ACHIEVED') return 'COMPLETED';
  if (s === 'CANCELLED' || s === 'ARCHIVED') return 'ARCHIVED';
  return 'PLANNED';
};

export const goalService = {
  async getGoals(params?: { projectId?: string; status?: string }): Promise<Goal[]> {
    const res = await goalsApi.getAll(params);
    const items = Array.isArray(res) ? res : res.data || [];
    return items.map((g: any) => ({
      id: g.id,
      title: g.title || 'Untitled Goal',
      description: g.description || '',
      targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split('T')[0] : '',
      progress: g.progress ?? 0,
      status: mapStatusFromApi(g.status),
      category: g.category || 'personal',
      metrics: g.metrics || '',
      projectId: g.projectId || (g.linkedProjectIds && g.linkedProjectIds[0]) || undefined,
    }));
  },

  async createGoal(goal: Partial<Goal> & { title: string; category: string }): Promise<Goal> {
    const res = await goalsApi.create({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      progress: goal.progress || 0,
      status: mapStatusToApi(goal.status || 'PLANNED'),
      category: goal.category,
      workspaceId: undefined,
    });
    const created: any = res.data || res;
    return {
      id: created.id,
      title: created.title || goal.title,
      description: created.description || goal.description || '',
      targetDate: created.targetDate
        ? new Date(created.targetDate).toISOString().split('T')[0]
        : goal.targetDate || '',
      progress: created.progress ?? goal.progress ?? 0,
      status: mapStatusFromApi(created.status || goal.status),
      category: created.category || goal.category || 'personal',
      metrics: goal.metrics || '',
      projectId: created.projectId || goal.projectId,
    };
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const res = await goalsApi.update(id, {
      title: updates.title,
      description: updates.description,
      targetDate: updates.targetDate,
      status: mapStatusToApi(updates.status),
      category: updates.category,
    });
    const updated: any = res.data || res;
    return {
      id: updated.id || id,
      title: updated.title || updates.title || 'Goal',
      description: updated.description || updates.description || '',
      targetDate: updated.targetDate
        ? new Date(updated.targetDate).toISOString().split('T')[0]
        : updates.targetDate || '',
      progress: updated.progress ?? updates.progress ?? 0,
      status: mapStatusFromApi(updated.status || updates.status),
      category: updated.category || updates.category || 'personal',
      metrics: updates.metrics || '',
      projectId: updated.projectId || updates.projectId,
    };
  },

  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const res = await goalsApi.updateProgress(id, progress);
    const updated: any = res.data || res;
    return {
      id: updated.id || id,
      title: updated.title || '',
      description: updated.description || '',
      targetDate: updated.targetDate
        ? new Date(updated.targetDate).toISOString().split('T')[0]
        : '',
      progress: updated.progress ?? progress,
      status: mapStatusFromApi(updated.status) || (progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'),
      category: updated.category || 'personal',
    };
  },

  async deleteGoal(id: string): Promise<void> {
    await goalsApi.delete(id);
  },
};
