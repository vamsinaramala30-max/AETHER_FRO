import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { fileManagerApi } from '@/projects/files/fileManagerApi';

describe('AETHER File Manager — API Client & Operations Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('fileManagerApi.listFiles', () => {
    it('queries files with folderId, category, and favorite filters', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          filename: 'Documentation.md',
          mimeType: 'text/markdown',
          size: 2048,
          createdAt: '2026-10-04T10:00:00Z',
          folderId: 'folder-123',
          folder: { id: 'folder-123', name: 'Docs' },
          isFavorite: true,
          favoriteId: 'fav-1',
          versionCount: 2,
        },
      ];

      vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: {
          files: mockFiles,
          pagination: { totalPages: 1, total: 1 },
        },
      } as any);

      const res = await fileManagerApi.listFiles({
        folderId: 'folder-123',
        category: 'Documents',
        favoriteOnly: true,
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/uploads?folderId=folder-123&category=Documents&favoriteOnly=true'),
      );
      expect(res.files).toHaveLength(1);
      expect(res.files[0].filename).toBe('Documentation.md');
      expect(res.files[0].isFavorite).toBe(true);
      expect(res.files[0].folder?.name).toBe('Docs');
    });

    it('queries root files when folderId is null', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: { files: [], pagination: { totalPages: 1, total: 0 } },
      } as any);

      await fileManagerApi.listFiles({ folderId: null });

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/uploads?folderId=root'),
      );
    });
  });

  describe('fileManagerApi Folders', () => {
    it('lists folders with parentId', async () => {
      const mockFolders = [
        { id: 'f-1', name: 'Engineering', parentId: null, _count: { files: 5, children: 2 } },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { folders: mockFolders } } as any);

      const folders = await fileManagerApi.listFolders(null);
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/uploads/folders?parentId=root'),
      );
      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Engineering');
      expect(folders[0].fileCount).toBe(5);
    });

    it('creates a new folder', async () => {
      const created = { id: 'f-new', name: 'Reports', parentId: 'f-1' };
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: created } as any);

      const res = await fileManagerApi.createFolder('Reports', 'f-1');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/folders', {
        name: 'Reports',
        parentId: 'f-1',
      });
      expect(res.id).toBe('f-new');
    });

    it('renames a folder', async () => {
      const updated = { id: 'f-1', name: 'Engineering V2' };
      vi.spyOn(apiClient, 'patch').mockResolvedValue({ data: updated } as any);

      const res = await fileManagerApi.renameFolder('f-1', 'Engineering V2');
      expect(apiClient.patch).toHaveBeenCalledWith('/uploads/folders/f-1', {
        name: 'Engineering V2',
      });
      expect(res.name).toBe('Engineering V2');
    });

    it('deletes a folder', async () => {
      vi.spyOn(apiClient, 'delete').mockResolvedValue({} as any);

      await fileManagerApi.deleteFolder('f-1');
      expect(apiClient.delete).toHaveBeenCalledWith('/uploads/folders/f-1');
    });
  });

  describe('fileManagerApi File Operations', () => {
    it('moves a file to a new folder', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { success: true } } as any);

      const res = await fileManagerApi.moveFile('file-1', 'folder-new');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/file-1/move', {
        folderId: 'folder-new',
      });
      expect(res.success).toBe(true);
    });

    it('duplicates / copies a file', async () => {
      const copy = { id: 'file-copy', filename: 'Doc (copy).md', size: 100 };
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: copy } as any);

      const res = await fileManagerApi.copyFile('file-1');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/file-1/copy', {
        newFilename: undefined,
      });
      expect(res.filename).toBe('Doc (copy).md');
    });

    it('creates an empty file on the server', async () => {
      const newFile = { id: 'new-file', filename: 'Notes.txt', size: 12 };
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: newFile } as any);

      const res = await fileManagerApi.createEmptyFile({
        filename: 'Notes.txt',
        content: 'hello',
        folderId: 'f-1',
      });
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/create-file', {
        filename: 'Notes.txt',
        content: 'hello',
        folderId: 'f-1',
      });
      expect(res.id).toBe('new-file');
    });
  });

  describe('fileManagerApi Trash Lifecycle', () => {
    it('moves file to trash', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { success: true } } as any);
      await fileManagerApi.moveToTrash('file-1');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/file-1/trash');
    });

    it('restores file from trash', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { success: true } } as any);
      await fileManagerApi.restoreFromTrash('file-1');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/file-1/restore');
    });

    it('fetches trashed files', async () => {
      const mockTrash = [
        { id: 't-1', filename: 'Old.pdf', isTrash: true, trashedAt: '2026-10-04T10:00:00Z' },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { files: mockTrash } } as any);

      const res = await fileManagerApi.getTrashFiles();
      expect(apiClient.get).toHaveBeenCalledWith('/uploads/trash');
      expect(res).toHaveLength(1);
      expect(res[0].filename).toBe('Old.pdf');
    });

    it('empties trash', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { count: 3 } } as any);
      const res = await fileManagerApi.emptyTrash();
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/empty-trash');
      expect(res.count).toBe(3);
    });

    it('permanently deletes a file', async () => {
      vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: { success: true } } as any);
      await fileManagerApi.permanentDelete('file-1');
      expect(apiClient.delete).toHaveBeenCalledWith('/uploads/file-1/permanent');
    });
  });

  describe('fileManagerApi Insights & AI', () => {
    it('fetches storage insights breakdown', async () => {
      const mockInsights = {
        totalFiles: 42,
        totalBytes: 52428800,
        categories: [{ name: 'Documents', bytes: 20000000, count: 10, percentage: 38.1 }],
      };
      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockInsights } as any);

      const res = await fileManagerApi.getStorageInsights();
      expect(apiClient.get).toHaveBeenCalledWith('/uploads/storage-insights');
      expect(res.totalFiles).toBe(42);
      expect(res.categories[0].name).toBe('Documents');
    });

    it('fetches duplicate file groups', async () => {
      const mockDuplicates = [
        {
          stem: 'project-brief',
          size: 1048576,
          files: [
            { id: 'f-1', filename: 'project-brief.pdf', size: 1048576 },
            { id: 'f-2', filename: 'project-brief (1).pdf', size: 1048576 },
          ],
        },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { duplicates: mockDuplicates } } as any);

      const res = await fileManagerApi.getDuplicates();
      expect(apiClient.get).toHaveBeenCalledWith('/uploads/duplicates');
      expect(res).toHaveLength(1);
      expect(res[0].stem).toBe('project-brief');
      expect(res[0].files).toHaveLength(2);
    });

    it('asks AI about a file content', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({
        data: { answer: 'This file specifies the Q4 project roadmap.', filename: 'Spec.md' },
      } as any);

      const res = await fileManagerApi.askAI('file-1', 'Summarize this file');
      expect(apiClient.post).toHaveBeenCalledWith('/uploads/file-1/ask-ai', {
        prompt: 'Summarize this file',
      });
      expect(res.answer).toContain('Q4 project roadmap');
    });
  });
});
