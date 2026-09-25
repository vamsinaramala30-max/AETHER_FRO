// frontend/src/knowledge/documents/documentsService.ts
import { DocumentItem } from '../types';
import { apiClient } from '@/api/client';
import { triggerActivityUpdate } from '@/shared/activityEvents';

export const documentsService = {
  async getDocuments(category?: string): Promise<DocumentItem[]> {
    try {
      const url = category
        ? `/knowledge/documents?category=${encodeURIComponent(category)}`
        : '/knowledge/documents';
      const res = await apiClient.get<any>(url);
      const payload = res.data || res;
      const rawDocs = Array.isArray(payload) ? payload : payload?.data || [];

      if (Array.isArray(rawDocs)) {
        const formatted: DocumentItem[] = rawDocs.map((d: any) => ({
          id: d.id,
          name: d.title || d.fileName || 'Untitled Document',
          size: d.metadata?.fileSize || d.fileSize || 0,
          mimeType: d.metadata?.mimeType || d.mimeType || 'application/json',
          url: d.fileKey || '',
          category: d.category || 'Reports',
          content: d.description || '',
          tags: d.tags || [],
          attachedFileIds: d.metadata?.attachedFileIds || [],
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString(),
          userId: d.ownerId || 'user',
          type: 'document',
          status: d.status || 'READY',
        }));
        try {
          localStorage.setItem('aether_docs', JSON.stringify(formatted));
        } catch {
          /* ignore quota */
        }
        return formatted;
      }
      return [];
    } catch (err) {
      // Re-throw so callers can accurately reflect failed synchronization
      throw err;
    }
  },

  async createDocument(data: {
    title: string;
    category: string;
    content?: string;
    tags?: string[];
    attachedFileIds?: string[];
  }): Promise<DocumentItem> {
    const res = await apiClient.post<any>('/knowledge/documents', {
      title: data.title,
      description: data.content || '',
      category: data.category || 'Reports',
      tags: data.tags || [],
      fileKey: '',
      fileSize: 0,
      mimeType: 'application/json',
      originalName: data.title,
      metadata: {
        attachedFileIds: data.attachedFileIds || [],
      },
    });
    const d = res.data || res;
    triggerActivityUpdate();
    return {
      id: d.id,
      name: d.title || data.title,
      size: 0,
      mimeType: 'application/json',
      url: '',
      category: d.category || data.category,
      content: d.description || data.content,
      tags: d.tags || data.tags || [],
      attachedFileIds: data.attachedFileIds || [],
      createdAt: d.createdAt || new Date().toISOString(),
      updatedAt: d.updatedAt || new Date().toISOString(),
      userId: d.ownerId || 'user',
      type: 'document',
      status: d.status || 'READY',
    };
  },

  async uploadDocument(file: File, tags: string[]): Promise<DocumentItem> {
    if (!file || file.size === 0) {
      throw new Error('Cannot upload an empty file.');
    }
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await apiClient.post<any>('/uploads/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const uploadData = uploadRes.data || uploadRes;
    const fileId = uploadData.id;

    return this.createDocument({
      title: file.name,
      category: 'Project Documents',
      tags,
      attachedFileIds: fileId ? [fileId] : [],
    });
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/documents/${id}`);
    triggerActivityUpdate();
    try {
      const stored = localStorage.getItem('aether_docs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localStorage.setItem('aether_docs', JSON.stringify(parsed.filter((d: any) => d.id !== id)));
        }
      }
    } catch {
      /* ignore storage error */
    }
  },
};
