export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0 to 100
  category: 'technical' | 'career' | 'personal';
  metrics: string;
}

const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Master Advanced WebGL & Three.js Shaders',
    description: 'Complete 3 non-trivial interactive animations.',
    targetDate: '2026-09-30',
    progress: 45,
    category: 'technical',
    metrics: '3 projects live',
  },
  {
    id: 'g2',
    title: 'Architect System Design Blueprint v2',
    description: 'Draft production documentation for high-throughput scaling.',
    targetDate: '2026-12-15',
    progress: 15,
    category: 'career',
    metrics: 'Approved RFC document',
  },
];

export const goalService = {
  getGoals(): Promise<Goal[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([...mockGoals]);
      }, 400),
    );
  },
  createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    return new Promise((resolve) => {
      const newGoal: Goal = { ...goal, id: `goal_${String(Date.now())}` };
      mockGoals.push(newGoal);
      setTimeout(() => {
        resolve(newGoal);
      }, 300);
    });
  },
  updateGoalProgress(id: string, progress: number): Promise<Goal> {
    return new Promise((resolve, reject) => {
      const goal = mockGoals.find((g) => g.id === id);
      if (!goal) {
        reject(new Error('Goal not found'));
        return;
      }
      goal.progress = Math.min(100, Math.max(0, progress));
      setTimeout(() => {
        resolve({ ...goal });
      }, 200);
    });
  },
};
