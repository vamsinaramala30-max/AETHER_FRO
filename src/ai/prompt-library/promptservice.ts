export interface SystemPrompt {
  id: string;
  title: string;
  description: string;
  template: string;
  category: 'engineering' | 'analysis' | 'creative' | 'utility';
  tokensEstimate: number;
}

class PromptService {
  private baseRoute = '/api/v1/ai/prompts';
  private fallbackKey = 'aether_prompt_library';

  private initialStore: SystemPrompt[] = [
    { id: 'p_1', title: 'Strict Refactor Context Isolation', description: 'Forces precise module boundaries without injecting boilerplate scaffolding.', template: 'Analyze the module code targeting component boundaries. Rewrite ensuring input contracts remain strictly invariant. Do not remove internal business logic hooks.', category: 'engineering', tokensEstimate: 45 },
    { id: 'p_2', title: 'Technical Spec Parsing', description: 'Converts unstructured markdown transcripts into clear semantic functional definitions.', template: 'Extract features, internal domain properties, and operational parameters from the following specifications: {{input}}', category: 'analysis', tokensEstimate: 32 }
  ];

  public async getPrompts(): Promise<SystemPrompt[]> {
    try {
      const res = await fetch(this.baseRoute);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const stored = localStorage.getItem(this.fallbackKey);
      if (!stored) {
        localStorage.setItem(this.fallbackKey, JSON.stringify(this.initialStore));
        return this.initialStore;
      }
      return JSON.parse(stored);
    }
  }

  public async savePrompt(prompt: SystemPrompt): Promise<SystemPrompt> {
    try {
      const res = await fetch(this.baseRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      return await res.json();
    } catch {
      const current = await this.getPrompts();
      const lookup = current.findIndex(p => p.id === prompt.id);
      let updated = [...current];
      if (lookup >= 0) updated[lookup] = prompt;
      else updated = [prompt, ...updated];
      localStorage.setItem(this.fallbackKey, JSON.stringify(updated));
      return prompt;
    }
  }
}

export const promptService = new PromptService();