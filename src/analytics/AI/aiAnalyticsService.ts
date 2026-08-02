export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'WeeklyPicks' | 'FreshAngles' | 'Optimize' | 'Direction';
  priority: 'high' | 'medium' | 'low';
  impactScore: number;
  actionableStep: string;
}

export interface AIAnalyticsSummary {
  weeklyPicks: AIRecommendation[];
  freshAngles: AIRecommendation[];
  optimize: AIRecommendation[];
  direction: AIRecommendation[];
}

export const fetchAIRecommendations = async (): Promise<AIAnalyticsSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    weeklyPicks: [
      {
        id: 'rec-1',
        title: 'Batch Morning Meetings',
        description:
          'Your peak focus period is between 9 AM and 11:30 AM. Move routine standups to late afternoon.',
        category: 'WeeklyPicks',
        priority: 'high',
        impactScore: 92,
        actionableStep: 'Auto-reschedule calendar blocks using AI Schedule Assistant.',
      },
    ],
    freshAngles: [
      {
        id: 'rec-2',
        title: 'Skill-Gap Bridge: Rust WebAssembly',
        description:
          'Analyzing your recent commits shows high execution overhead in parsing pipelines.',
        category: 'FreshAngles',
        priority: 'medium',
        impactScore: 78,
        actionableStep: 'Review recommended WASM optimization modules.',
      },
    ],
    optimize: [
      {
        id: 'rec-3',
        title: 'Reduce Context Switching in Sprint Tasks',
        description: 'You switched context 14 times yesterday across 3 unrelated projects.',
        category: 'Optimize',
        priority: 'high',
        impactScore: 88,
        actionableStep: 'Enable Pomodoro Focus Lock to restrict tab switching.',
      },
    ],
    direction: [
      {
        id: 'rec-4',
        title: 'Align Q3 Goal Milestones with Deep Work Trends',
        description:
          'Current velocity suggests Q3 architectural goals need 10% more focus allocation.',
        category: 'Direction',
        priority: 'low',
        impactScore: 84,
        actionableStep: 'Adjust target dates or delegate sub-tasks.',
      },
    ],
  };
};
