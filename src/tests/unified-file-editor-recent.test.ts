import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { recentFilesService } from '@/workspace/recent-files/recentfilesservices';
import { documentsService } from '@/knowledge/documents/documentservice';

describe('Unified File Architecture — Frontend Services Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('recentFilesService', () => {
    it('fetches recent files from backend API and caches in localStorage', async () => {
      const mockBackendFiles = [
        {
          id: 'file-123',
          name: 'project_spec.md',
          type: 'document',
          lastAccessed: '2026-10-03T12:00:00.000Z',
          sizeStr: '12.4 KB',
          size: 12697,
          location: 'Workspace Files',
          mimeType: 'text/markdown',
        },
        {
          id: 'file-456',
          name: 'financial_projections.xlsx',
          type: 'spreadsheet',
          lastAccessed: '2026-10-03T11:30:00.000Z',
          sizeStr: '45.1 KB',
          size: 46182,
          location: 'Project Files',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ];

      vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: mockBackendFiles,
      } as any);

      const result = await recentFilesService.getRecentFiles('ws-1', 'proj-1');

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/uploads/recent?workspaceId=ws-1&projectId=proj-1&limit=30'),
      );
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('project_spec.md');
      expect(result[1].type).toBe('spreadsheet');

      // Verify cached into localStorage
      const cached = localStorage.getItem('aether_workspace_recent_files');
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached!)).toHaveLength(2);
    });

    it('falls back to localStorage cache if backend API fails', async () => {
      const cachedFiles = [
        {
          id: 'file-cached',
          name: 'cached_document.txt',
          type: 'document',
          lastAccessed: '2026-10-03T09:00:00.000Z',
          sizeStr: '2.1 KB',
          location: 'Workspace Files',
        },
      ];
      localStorage.setItem('aether_workspace_recent_files', JSON.stringify(cachedFiles));

      vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network error'));

      const result = await recentFilesService.getRecentFiles();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('file-cached');
      expect(result[0].name).toBe('cached_document.txt');
    });
  });

  describe('documentsService.updateDocument', () => {
    it('patches document content and title and returns updated document', async () => {
      const mockUpdated = {
        id: 'doc-789',
        title: 'Updated Strategy Brief',
        description: '# Executive Strategy\nUpdated Q4 roadmap.',
        category: 'Reports',
        tags: ['strategy', 'q4'],
        fileSize: 1024,
        mimeType: 'text/markdown',
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-03T12:00:00Z',
        ownerId: 'user-1',
      };

      vi.spyOn(apiClient, 'patch').mockResolvedValue({
        data: mockUpdated,
      } as any);

      const doc = await documentsService.updateDocument('doc-789', {
        title: 'Updated Strategy Brief',
        content: '# Executive Strategy\nUpdated Q4 roadmap.',
        category: 'Reports',
        tags: ['strategy', 'q4'],
      });

      expect(apiClient.patch).toHaveBeenCalledWith('/knowledge/documents/doc-789', {
        title: 'Updated Strategy Brief',
        description: '# Executive Strategy\nUpdated Q4 roadmap.',
        category: 'Reports',
        tags: ['strategy', 'q4'],
      });

      expect(doc.id).toBe('doc-789');
      expect(doc.name).toBe('Updated Strategy Brief');
      expect(doc.content).toBe('# Executive Strategy\nUpdated Q4 roadmap.');
    });
  });
});
