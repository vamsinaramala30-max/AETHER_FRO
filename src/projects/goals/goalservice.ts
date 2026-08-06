import { goalsApi } from '../../api/goals.api';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: 'technical' | 'career' | 'personal';
  metrics?: string;
}

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const res = await goalsApi.getAll();
    const items = res.data || [];
    return items.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description || '',
      targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split('T')[0] : '',
      progress: g.progress || 0,
      category: (g.category as Goal['category']) || 'personal',
    }));
  },

  async createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    const res = await goalsApi.create({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      progress: goal.progress,
      category: goal.category,
    });
    const created = res.data;
    return {
      id: created.id,
      title: created.title,
      description: created.description || '',
      targetDate: created.targetDate ? new Date(created.targetDate).toISOString().split('T')[0] : '',
      progress: created.progress || 0,
      category: (created.category as Goal['category']) || goal.category,
    };
  },

  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const res = await goalsApi.updateProgress(id, progress);
    const updated = res.data;
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description || '',
      targetDate: updated.targetDate ? new Date(updated.targetDate).toISOString().split('T')[0] : '',
      progress: updated.progress || progress,
      category: (updated.category as Goal['category']) || 'personal',
    };
  },

  async deleteGoal(id: string): Promise<void> {
    await goalsApi.delete(id);
  },
};
