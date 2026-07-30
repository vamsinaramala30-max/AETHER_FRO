export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  confidenceScore: number;
  type: 'optimization' | 'security' | 'task';
  suggestedActions: {
    id: string;
    label: string;
    actionPayload: string;
  }[];
}

export async function fetchAIRecommendations(): Promise<AIRecommendation[]> {
  return [
    {
      id: 'rec-1',
      title: 'Optimize Tailwind CSS Bundle Size',
      reason: 'Detected 4 unused CSS modules imported in bundle entry point',
      confidenceScore: 0.94,
      type: 'optimization',
      suggestedActions: [
        { id: 'sa-1', label: 'Run Purge Utility', actionPayload: 'cmd:purge-css' },
        { id: 'sa-2', label: 'View Asset Breakdown', actionPayload: 'nav:/analytics/bundle' },
      ],
    },
    {
      id: 'rec-2',
      title: 'Rotate API Master Tokens',
      reason: 'Token secret #0294 has not been rotated in over 90 days',
      confidenceScore: 0.98,
      type: 'security',
      suggestedActions: [
        { id: 'sa-3', label: 'Rotate Now', actionPayload: 'cmd:rotate-token' },
      ],
    },
  ];
}