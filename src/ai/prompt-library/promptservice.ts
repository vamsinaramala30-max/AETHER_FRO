import { apiClient } from '../../api/client';

export interface SystemPrompt {
  id: string;
  title: string;
  description: string;
  template: string;
  category: 'engineering' | 'analysis' | 'creative' | 'utility';
  tokensEstimate: number;
}

class PromptService {
  private baseRoute = '/ai/prompts';

  public async getPrompts(): Promise<SystemPrompt[]> {
    const res = await apiClient.get<any>(this.baseRoute);
    const list = Array.isArray(res) ? res : (res?.data ?? []);
    return list;
  }

  public async savePrompt(prompt: SystemPrompt): Promise<SystemPrompt> {
    const res = await apiClient.post<any>(this.baseRoute, prompt);
    const saved = res?.data ?? res;
    return saved;
  }
}

export const promptService = new PromptService();
