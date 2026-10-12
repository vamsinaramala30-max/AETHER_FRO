import { apiClient } from '@/api/client';
import { env } from '@/config/environment';
import { authConfig } from '@/config/auth.config';
import {
  FileItem,
  FolderItem,
  FolderBreadcrumb,
  StorageInsights,
  DuplicateGroup,
} from './types';

export const fileManagerApi = {
  async listFiles(params: {
    search?: string;
    folderId?: string | null;
    category?: string;
    favoriteOnly?: boolean;
    isTrash?: boolean;
    includeTrash?: boolean;
    projectId?: string;
    hasProject?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ files: FileItem[]; totalPages: number; total: number }> {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.folderId !== undefined) {
      q.set('folderId', params.folderId === null ? 'root' : params.folderId);
    }
    if (params.category && params.category !== 'All Files') {
      q.set('category', params.category);
    }
    if (params.favoriteOnly) q.set('favoriteOnly', 'true');
    if (params.includeTrash) q.set('includeTrash', 'true');
    if (params.isTrash) q.set('includeTrash', 'true');
    if (params.hasProject) q.set('hasProject', 'true');
    if (params.projectId) {
      if (params.projectId === 'all') {
        q.set('hasProject', 'true');
      } else {
        q.set('projectId', params.projectId);
      }
    }
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));

    const res = await apiClient.get<any>(`/uploads?${q.toString()}`);
    const payload = res.data || res;
    const rawFiles = Array.isArray(payload) ? payload : payload?.files || payload?.data || [];
    const files: FileItem[] = rawFiles.map((f: any) => ({
      id: f.id || `file-${Date.now()}`,
      filename: f.filename || f.originalname || 'Untitled File',
      mimeType: f.mimeType || f.mimetype || 'application/octet-stream',
      size: f.size || 1024,
      createdAt: f.createdAt || new Date().toISOString(),
      uploadedAt: f.uploadedAt || f.createdAt || new Date().toISOString(),
      updatedAt: f.updatedAt,
      uploadedBy: f.uploadedBy || f.user?.name || f.user?.email,
      url: f.url,
      storageKey: f.storageKey,
      checksum: f.checksum,
      status: f.status || 'READY',
      tags: f.tags || [],
      folderId: f.folderId || null,
      folder: f.folder
        ? {
            id: f.folder.id,
            name: f.folder.name === 'vk' || f.folder.name === 'VK' ? 'Storage' : f.folder.name,
          }
        : null,
      isFavorite: !!f.isFavorite,
      favoriteId: f.favoriteId,
      isTrash: !!f.isTrash,
      trashedAt: f.trashedAt || null,
      versionCount: f.versionCount || f.versions?.length || 1,
      type: f.type || 'DOCUMENT',
      projectId: f.projectId || null,
      isKnowledge: !!f.isKnowledge,
      extractedText: f.extractedText || null,
      description: f.description || null,
      versions: f.versions || [],
    }));

    return {
      files,
      totalPages: payload?.pagination?.totalPages || 1,
      total: payload?.pagination?.total || files.length,
    };
  },

  async listFolders(parentId?: string | null): Promise<FolderItem[]> {
    const q = new URLSearchParams();
    if (parentId !== undefined) {
      q.set('parentId', parentId === null ? 'root' : parentId);
    }
    const res = await apiClient.get<any>(`/uploads/folders?${q.toString()}`);
    const payload = res.data || res;
    const list = Array.isArray(payload) ? payload : payload?.folders || [];
    return list.map((f: any) => ({
      id: f.id,
      name: f.name === 'vk' || f.name === 'VK' ? 'Storage' : f.name,
      parentId: f.parentId || null,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      fileCount: f._count?.files ?? f.fileCount ?? 0,
      subfolderCount: f._count?.children ?? f.subfolderCount ?? 0,
    }));
  },

  async createFolder(name: string, parentId?: string | null): Promise<FolderItem> {
    const res = await apiClient.post<any>('/uploads/folders', {
      name,
      parentId: parentId || undefined,
    });
    return res.data || res;
  },

  async renameFolder(id: string, name: string): Promise<FolderItem> {
    const res = await apiClient.patch<any>(`/uploads/folders/${id}`, { name });
    return res.data || res;
  },

  async deleteFolder(id: string): Promise<void> {
    await apiClient.delete(`/uploads/folders/${id}`);
  },

  async getFolderBreadcrumbs(folderId: string): Promise<FolderBreadcrumb[]> {
    const res = await apiClient.get<any>(`/uploads/folders/${folderId}/breadcrumbs`);
    const payload = res.data || res;
    const list = Array.isArray(payload) ? payload : payload?.breadcrumbs || [];
    return list.map((b: any) => ({
      id: b.id,
      name: b.name === 'vk' || b.name === 'VK' ? 'Storage' : b.name,
    }));
  },

  async moveFile(fileId: string, folderId: string | null): Promise<any> {
    const res = await apiClient.post<any>(`/uploads/${fileId}/move`, { folderId });
    return res.data || res;
  },

  async copyFile(fileId: string, newFilename?: string): Promise<FileItem> {
    const res = await apiClient.post<any>(`/uploads/${fileId}/copy`, { newFilename });
    return res.data || res;
  },

  async moveToTrash(fileId: string): Promise<any> {
    const res = await apiClient.post<any>(`/uploads/${fileId}/trash`);
    return res.data || res;
  },

  async restoreFromTrash(fileId: string): Promise<any> {
    const res = await apiClient.post<any>(`/uploads/${fileId}/restore`);
    return res.data || res;
  },

  async permanentDelete(fileId: string): Promise<any> {
    const res = await apiClient.delete<any>(`/uploads/${fileId}/permanent`);
    return res.data || res;
  },

  async getTrashFiles(): Promise<FileItem[]> {
    const res = await apiClient.get<any>('/uploads/trash');
    const payload = res.data || res;
    const rawFiles = Array.isArray(payload) ? payload : payload?.files || [];
    return rawFiles.map((f: any) => ({
      id: f.id,
      filename: f.filename,
      mimeType: f.mimeType,
      size: f.size,
      createdAt: f.createdAt,
      status: f.status,
      isTrash: true,
      trashedAt: f.trashedAt,
      folderId: f.folderId,
      folder: f.folder,
      versionCount: f.versionCount || 1,
    }));
  },

  async emptyTrash(): Promise<{ count: number }> {
    const res = await apiClient.post<any>('/uploads/empty-trash');
    return res.data || res;
  },

  async createEmptyFile(payload: {
    filename: string;
    content?: string;
    folderId?: string | null;
    projectId?: string;
  }): Promise<FileItem> {
    const res = await apiClient.post<any>('/uploads/create-file', payload);
    return res.data || res;
  },

  uploadSingleFile(
    file: File,
    folderId?: string | null,
    projectId?: string,
    onProgress?: (loaded: number, total: number, percent: number) => void,
    onProcessing?: () => void,
  ): { promise: Promise<FileItem>; abort: () => void } {
    let xhr: XMLHttpRequest;
    const promise = new Promise<FileItem>((resolve, reject) => {
      xhr = new XMLHttpRequest();
      const base = this.getApiBaseUrl();
      xhr.open('POST', `${base}/uploads/single`, true);

      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      const validFolderId =
        folderId && typeof folderId === 'string' && folderId.trim() !== '' && folderId.trim().toLowerCase() !== 'root'
          ? folderId.trim()
          : null;
      if (validFolderId) {
        xhr.setRequestHeader('x-folder-id', validFolderId);
      }
      const validProjectId =
        projectId && typeof projectId === 'string' && projectId.trim() !== '' && projectId.trim().toLowerCase() !== 'all'
          ? projectId.trim()
          : null;
      if (validProjectId) {
        xhr.setRequestHeader('x-project-id', validProjectId);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
          onProgress?.(e.loaded, e.total, percent);
          if (e.loaded >= e.total) {
            onProcessing?.();
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            const data = res?.data || res;
            const mapped: FileItem = {
              id: data.id || `file-${Date.now()}`,
              filename: data.filename || data.originalName || file.name,
              mimeType: data.detectedMimeType || data.mimeType || file.type || 'application/octet-stream',
              size: data.size || file.size,
              createdAt: data.createdAt || new Date().toISOString(),
              uploadedAt: data.uploadedAt || data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt,
              uploadedBy: data.uploadedBy,
              url: data.url,
              storageKey: data.storageKey,
              checksum: data.checksum,
              status: data.status || 'READY',
              tags: data.tags || [],
              folderId: data.folderId || folderId || null,
              folder: data.folder || null,
              isFavorite: !!data.isFavorite,
              favoriteId: data.favoriteId,
              isTrash: false,
              trashedAt: null,
              versionCount: 1,
              type: data.category || 'DOCUMENT',
              projectId: data.projectId || projectId || null,
              isKnowledge: false,
            };
            resolve(mapped);
          } catch {
            reject(new Error('Invalid response format from server.'));
          }
        } else {
          let msg = `Upload failed (HTTP ${xhr.status})`;
          try {
            const errRes = JSON.parse(xhr.responseText);
            msg = errRes?.message || errRes?.error || msg;
          } catch {}
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during file upload. Check your connection.'));
      };

      xhr.onabort = () => {
        reject(new Error('Upload cancelled.'));
      };

      const formData = new FormData();
      formData.append('file', file);
      if (validFolderId) formData.append('folderId', validFolderId);
      if (validProjectId) formData.append('projectId', validProjectId);

      xhr.send(formData);
    });

    return {
      promise,
      abort: () => {
        if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.abort();
        }
      },
    };
  },

  async getRecentFiles(limit = 50): Promise<FileItem[]> {
    const res = await apiClient.get<any>(`/uploads/recent?limit=${limit}`);
    const payload = res.data || res;
    const rawFiles = Array.isArray(payload) ? payload : payload?.files || payload?.data || [];
    return rawFiles.map((f: any) => ({
      id: f.id || `file-${Date.now()}`,
      filename: f.filename || f.originalname || 'Untitled File',
      mimeType: f.mimeType || f.mimetype || 'application/octet-stream',
      size: f.size || 0,
      createdAt: f.createdAt || new Date().toISOString(),
      uploadedAt: f.uploadedAt || f.createdAt || new Date().toISOString(),
      updatedAt: f.updatedAt,
      uploadedBy: f.uploadedBy || f.user?.name || f.user?.email,
      url: f.url,
      storageKey: f.storageKey,
      checksum: f.checksum,
      status: f.status || 'READY',
      tags: f.tags || [],
      folderId: f.folderId || null,
      folder: f.folder
        ? {
            id: f.folder.id,
            name: f.folder.name === 'vk' || f.folder.name === 'VK' ? 'Storage' : f.folder.name,
          }
        : null,
      isFavorite: !!f.isFavorite,
      favoriteId: f.favoriteId,
      isTrash: !!f.isTrash,
      trashedAt: f.trashedAt || null,
      versionCount: f.versionCount || f.versions?.length || 1,
      type: f.type || 'DOCUMENT',
      projectId: f.projectId || null,
      isKnowledge: !!f.isKnowledge,
      extractedText: f.extractedText || null,
      description: f.description || null,
      versions: f.versions || [],
    }));
  },

  async getStorageInsights(): Promise<StorageInsights> {
    const res = await apiClient.get<any>('/uploads/storage-insights');
    return res.data || res;
  },

  async getDuplicates(): Promise<DuplicateGroup[]> {
    const res = await apiClient.get<any>('/uploads/duplicates');
    const payload = res.data || res;
    return Array.isArray(payload) ? payload : payload?.duplicates || [];
  },

  async askAI(fileId: string, prompt: string): Promise<{ answer: string; filename: string }> {
    const res = await apiClient.post<any>(`/uploads/${fileId}/ask-ai`, { prompt });
    return res.data || res;
  },

  getAuthToken(): string {
    let token =
      localStorage.getItem(authConfig.tokenKey) ||
      localStorage.getItem('aether_access_token') ||
      localStorage.getItem('aether-auth-token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('aether_token') ||
      localStorage.getItem('accessToken');
    if (!token) {
      try {
        const zustandStore = localStorage.getItem('aether-auth-storage');
        if (zustandStore) {
          const parsed = JSON.parse(zustandStore);
          if (parsed?.state?.token && typeof parsed.state.token === 'string') {
            token = parsed.state.token;
          }
        }
      } catch {}
    }
    return token || '';
  },

  getApiBaseUrl(): string {
    const raw = env.VITE_API_BASE_URL || '/api/v1';
    return raw.replace(/\/+$/, '');
  },

  getDownloadUrl(id: string): string {
    const base = this.getApiBaseUrl();
    const token = this.getAuthToken();
    return token
      ? `${base}/uploads/${id}/download?token=${encodeURIComponent(token)}`
      : `${base}/uploads/${id}/download`;
  },

  getPreviewUrl(id: string): string {
    const base = this.getApiBaseUrl();
    const token = this.getAuthToken();
    return token
      ? `${base}/uploads/${id}/preview?token=${encodeURIComponent(token)}`
      : `${base}/uploads/${id}/preview`;
  },
};
