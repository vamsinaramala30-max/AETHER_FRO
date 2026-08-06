export interface RecentFileData {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'code' | 'model' | 'diagram';
  lastAccessed: string; // ISO String
  sizeStr: string;
  location: string;
}

const STORAGE_KEY = 'aether_workspace_recent_files';

export const recentFilesService = {
  async getRecentFiles(): Promise<RecentFileData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window === 'undefined') {
          resolve([]);
          return;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (typeof stored !== 'string' || stored.trim() === '') {
          resolve([]);
          return;
        }
        try {
          const parsed = JSON.parse(stored) as RecentFileData[];
          resolve(Array.isArray(parsed) ? parsed : []);
        } catch {
          resolve([]);
        }
      }, 150);
    });
  },
};
