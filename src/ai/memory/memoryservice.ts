import { apiClient } from '../../api/client';

export interface MemoryItem {
  id: string;
  category: 'episodic' | 'semantic' | 'procedural' | 'fact' | 'preference' | 'workspace' | 'project';
  content: string;
  importanceScore: number; // 1-10
  associatedTokens: string[];
  scope?: 'GLOBAL_USER' | 'CONVERSATION' | 'WORKSPACE' | 'PROJECT';
  confidence?: 'confirmed' | 'user_provided' | 'inferred' | 'temporary';
  version?: number;
  workspaceId?: string;
  projectId?: string;
  createdAt: string;
}

class MemoryService {
  public async getMemories(): Promise<MemoryItem[]> {
    try {
      const res = await apiClient.get<any>('/ai/memory');
      const payload = res?.data?.data || res?.data || res;
      if (Array.isArray(payload)) {
        return payload.map((m: any) => ({
          id: m.id || m.doc_id || crypto.randomUUID(),
          category: (m.category || m.type || 'fact') as MemoryItem['category'],
          content: m.content || m.fact || m.text || '',
          importanceScore: m.importanceScore ?? (typeof m.importance === 'number' ? Math.round(m.importance * 10) : 7),
          associatedTokens: Array.isArray(m.associatedTokens) ? m.associatedTokens : (m.tokens || []),
          scope: m.scope,
          confidence: m.confidence,
          version: m.version,
          workspaceId: m.workspaceId,
          projectId: m.projectId,
          createdAt: typeof m.createdAt === 'number' ? new Date(m.createdAt).toISOString() : (m.createdAt || new Date().toISOString()),
        }));
      }
      return [];
    } catch (err) {
      console.error('[MemoryService] getMemories failed:', err);
      return [];
    }
  }

  public async deleteMemory(id: string): Promise<boolean> {
    await apiClient.delete(`/ai/memory/${id}`);
    return true;
  }

  public async addMemory(
    factOrPayload: string | { content: string; category?: MemoryItem['category']; scope?: MemoryItem['scope']; confidence?: MemoryItem['confidence']; workspaceId?: string; projectId?: string },
    defaultCategory: MemoryItem['category'] = 'semantic',
  ): Promise<MemoryItem> {
    const payload = typeof factOrPayload === 'string'
      ? { content: factOrPayload, category: defaultCategory, scope: 'GLOBAL_USER' as const, confidence: 'user_provided' as const }
      : {
          content: factOrPayload.content,
          category: factOrPayload.category || defaultCategory,
          scope: factOrPayload.scope || 'GLOBAL_USER',
          confidence: factOrPayload.confidence || 'user_provided',
          workspaceId: factOrPayload.workspaceId,
          projectId: factOrPayload.projectId,
        };

    const res = await apiClient.post<any>('/ai/memory', payload);
    const data = res?.data || res;
    return {
      id: data?.id || crypto.randomUUID(),
      category: payload.category,
      content: payload.content,
      importanceScore: data?.importanceScore ?? 8,
      associatedTokens: data?.associatedTokens || [],
      scope: data?.scope || payload.scope,
      confidence: data?.confidence || payload.confidence,
      version: data?.version || 1,
      workspaceId: payload.workspaceId,
      projectId: payload.projectId,
      createdAt: data?.createdAt || new Date().toISOString(),
    };
  }

  public async updateMemory(id: string, patch: Partial<MemoryItem>): Promise<boolean> {
    await apiClient.patch(`/ai/memory/${id}`, patch);
    return true;
  }

  public async searchMemories(query: string, scope?: string): Promise<MemoryItem[]> {
    try {
      const res = await apiClient.post<any>('/ai/memory/search', { text: query, scope });
      const payload = res?.data?.data || res?.data || res;
      if (Array.isArray(payload)) {
        return payload.map((m: any) => ({
          id: m.id || crypto.randomUUID(),
          category: (m.category || m.type || 'fact') as MemoryItem['category'],
          content: m.content || m.fact || '',
          importanceScore: m.importanceScore ?? 7,
          associatedTokens: Array.isArray(m.associatedTokens) ? m.associatedTokens : (m.tokens || []),
          scope: m.scope,
          confidence: m.confidence,
          version: m.version,
          workspaceId: m.workspaceId,
          projectId: m.projectId,
          createdAt: typeof m.createdAt === 'number' ? new Date(m.createdAt).toISOString() : (m.createdAt || new Date().toISOString()),
        }));
      }
      return [];
    } catch (err) {
      console.error('[MemoryService] searchMemories failed:', err);
      return [];
    }
  }
}

export const memoryService = new MemoryService();
