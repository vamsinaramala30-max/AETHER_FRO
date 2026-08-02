export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'Strategic' | 'Operational' | 'Skill' | 'Personal';
  progress: number;
  targetDate: string;
  milestones: Milestone[];
}

export interface GoalAnalyticsSummary {
  activeGoals: number;
  completedGoals: number;
  successRate: number;
  goals: GoalItem[];
  progressTrend: Array<{ period: string; completed: number; inProgress: number }>;
}

export const fetchGoalAnalytics = async (): Promise<GoalAnalyticsSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 450));

  return {
    activeGoals: 8,
    completedGoals: 14,
    successRate: 82.3,
    goals: [
      {
        id: 'g-1',
        title: 'Launch AI Copilot v2.0 Architecture',
        category: 'Strategic',
        progress: 85,
        targetDate: '2026-08-30',
        milestones: [
          { id: 'm-1', title: 'API Integration', completed: true, dueDate: '2026-07-01' },
          { id: 'm-2', title: 'Security Audit', completed: true, dueDate: '2026-07-15' },
          { id: 'm-3', title: 'Global Deployment', completed: false, dueDate: '2026-08-30' },
        ],
      },
      {
        id: 'g-2',
        title: 'Optimize Front-End Bundle Size by 35%',
        category: 'Operational',
        progress: 60,
        targetDate: '2026-09-15',
        milestones: [
          { id: 'm-4', title: 'Tree-shaking Recharts', completed: true, dueDate: '2026-07-10' },
          {
            id: 'm-5',
            title: 'Code splitting React Router',
            completed: false,
            dueDate: '2026-08-10',
          },
        ],
      },
    ],
    progressTrend: [
      { period: 'W1', completed: 2, inProgress: 6 },
      { period: 'W2', completed: 4, inProgress: 5 },
      { period: 'W3', completed: 7, inProgress: 4 },
      { period: 'W4', completed: 10, inProgress: 3 },
    ],
  };
};
