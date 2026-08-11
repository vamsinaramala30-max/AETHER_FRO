// frontend/src/knowledge/documents/documentsService.ts
import { DocumentItem } from '../types';
import { apiClient } from '@/api/client';
import { triggerActivityUpdate } from '@/shared/activityEvents';

export const documentsService = {
  async getDocuments(category?: string): Promise<DocumentItem[]> {
    try {
      const url = category ? `/knowledge/documents?category=${encodeURIComponent(category)}` : '/knowledge/documents';
      const res = await apiClient.get<any>(url);
      const payload = res.data || res;
      const rawDocs = Array.isArray(payload) ? payload : payload?.data || [];

      if (Array.isArray(rawDocs)) {
        const formatted: DocumentItem[] = rawDocs.map((d: any) => ({
          id: d.id,
          name: d.title || d.fileName || 'Untitled Document',
          size: d.metadata?.fileSize || 0,
          mimeType: d.metadata?.mimeType || 'application/json',
          url: d.fileKey || '',
          category: d.category || 'Reports',
          content: d.description || '',
          tags: d.tags || [],
          attachedFileIds: d.metadata?.attachedFileIds || [],
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString(),
          userId: d.ownerId || 'user',
          type: 'document',
        }));
        localStorage.setItem('aether_docs', JSON.stringify(formatted));
        return formatted;
      }
    } catch {
      // Local fallback
      const stored = localStorage.getItem('aether_docs');
      if (typeof stored === 'string' && stored.trim() !== '') {
        try {
          const parsed = JSON.parse(stored) as DocumentItem[];
          return Array.isArray(parsed) ? parsed : [];
        } catch {}
      }
    }
    return [];
  },

  async createDocument(data: {
    title: string;
    category: string;
    content?: string;
    tags?: string[];
    attachedFileIds?: string[];
  }): Promise<DocumentItem> {
    try {
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
      };
    } catch {
      const docs = await this.getDocuments();
      const now = new Date().toISOString();
      const newDoc: DocumentItem = {
        id: crypto.randomUUID(),
        name: data.title,
        size: 0,
        mimeType: 'application/json',
        url: '',
        category: data.category,
        content: data.content,
        tags: data.tags || [],
        attachedFileIds: data.attachedFileIds || [],
        createdAt: now,
        updatedAt: now,
        userId: 'current-user',
        type: 'document',
      };
      docs.unshift(newDoc);
      localStorage.setItem('aether_docs', JSON.stringify(docs));
      return newDoc;
    }
  },

  async uploadDocument(file: File, tags: string[]): Promise<DocumentItem> {
    return this.createDocument({
      title: file.name,
      category: 'Project Documents',
      tags,
    });
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      await apiClient.delete(`/knowledge/documents/${id}`);
      triggerActivityUpdate();
    } catch {}
    const docs = await this.getDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    localStorage.setItem('aether_docs', JSON.stringify(filtered));
  },
};

