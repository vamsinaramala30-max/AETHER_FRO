export interface MemoryItem {
  id: string;
  category: 'episodic' | 'semantic' | 'procedural';
  content: string;
  importanceScore: number; // 1-10
  associatedTokens: string[];
  createdAt: string;
}

class MemoryService {
  private baseRoute = '/api/v1/ai/memory';
  private fallbackKey = 'aether_vector_memories';

  private seedData: MemoryItem[] = [
    { id: 'mem_1', category: 'semantic', content: 'Prefers deep dark interface variants; enforces strict design token consistency across Tailwind workflows.', importanceScore: 8, associatedTokens: ['ui', 'ux', 'theme'], createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'mem_2', category: 'episodic', content: 'Indicated current API server addresses use port 8080 under staging routes.', importanceScore: 9, associatedTokens: ['network', 'api'], createdAt: new Date().toISOString() }
  ];

  public async getMemories(): Promise<MemoryItem[]> {
    try {
      const res = await fetch(this.baseRoute);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const cache = localStorage.getItem(this.fallbackKey);
      if (!cache) {
        localStorage.setItem(this.fallbackKey, JSON.stringify(this.seedData));
        return this.seedData;
      }
      return JSON.parse(cache);
    }
  }

  public async deleteMemory(id: string): Promise<boolean> {
    try {
      await fetch(`${this.baseRoute}/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const data = await this.getMemories();
      const filtered = data.filter(m => m.id !== id);
      localStorage.setItem(this.fallbackKey, JSON.stringify(filtered));
      return true;
    }
  }
}

export const memoryService = new MemoryService();