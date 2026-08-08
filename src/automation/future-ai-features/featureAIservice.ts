export interface PreviewFeature {
  id: string;
  title: string;
  description: string;
  estimatedArrival: string;
  tierRequirement: 'Standard' | 'Enterprise Advanced';
  systemImpactScore: string;
}

export const featureService = {
  async getPreviews(): Promise<PreviewFeature[]> {
    return [];
  },
};

