// frontend/src/workspace/recent-files/recentFilesService.ts

export interface RecentFileData {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'code' | 'model' | 'diagram';
  lastAccessed: string; // ISO String
  sizeStr: string;
  location: string;
}

const defaultFiles: RecentFileData[] = [
  {
    id: 'f1',
    name: 'aether-core-schema.ts',
    type: 'code',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    sizeStr: '42 KB',
    location: '/src/core/schema',
  },
  {
    id: 'f2',
    name: 'architecture_map_v4.diagram',
    type: 'diagram',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 140).toISOString(), // ~2h ago
    sizeStr: '1.8 MB',
    location: '/assets/docs',
  },
  {
    id: 'f3',
    name: 'operational_budget_2026.spreadsheet',
    type: 'spreadsheet',
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    sizeStr: '512 KB',
    location: '/finance/models',
  },
];

export const recentFilesService = {
  async getRecentFiles(): Promise<RecentFileData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(defaultFiles);
      }, 200);
    });
  },
};
