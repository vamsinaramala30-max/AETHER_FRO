import { apiClient } from '@/api/client';

export interface RecentFileData {
  id: string;
  name: string;
  filename?: string;
  type: 'document' | 'spreadsheet' | 'code' | 'model' | 'diagram';
  lastAccessed: string; // ISO String
  sizeStr: string;
  size?: number;
  location: string;
  mimeType?: string;
  projectId?: string;
  workspaceId?: string;
}

const STORAGE_KEY = 'aether_workspace_recent_files';

export const recentFilesService = {
  async getRecentFiles(workspaceId?: string, projectId?: string): Promise<RecentFileData[]> {
    try {
      const params = new URLSearchParams();
      if (workspaceId) params.set('workspaceId', workspaceId);
      if (projectId) params.set('projectId', projectId);
      params.set('limit', '30');

      const qs = params.toString();
      const res = await apiClient.get<any>(`/uploads/recent${qs ? `?${qs}` : ''}`);
      const payload = res.data || res;
      const files = Array.isArray(payload) ? payload : payload?.data || [];
      if (Array.isArray(files)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
        } catch {}
        return files;
      }
    } catch (err) {
      console.warn('Failed to fetch recent files from backend, checking local cache:', err);
    }

    // LocalStorage fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (typeof stored === 'string' && stored.trim() !== '') {
        try {
          const parsed = JSON.parse(stored) as RecentFileData[];
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return [];
  },
};
