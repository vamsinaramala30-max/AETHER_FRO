// frontend/src/knowledge/documents/documentsService.ts
import { DocumentItem } from '../types';

export const documentsService = {
  async getDocuments(): Promise<DocumentItem[]> {
    await new Promise((res) => setTimeout(res, 500));
    const stored = localStorage.getItem('aether_docs');
    if (typeof stored === 'string' && stored.trim() !== '') {
      try {
        const parsed = JSON.parse(stored) as DocumentItem[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  },

  async uploadDocument(file: File, tags: string[]): Promise<DocumentItem> {
    await new Promise((res) => setTimeout(res, 1200)); // Simulate upload
    const docs = await this.getDocuments();

    const newDoc: DocumentItem = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file), // Local fallback object URL
      tags,
      createdAt: new Date().toISOString(),
      userId: 'current-user',
      type: 'document',
      updatedAt: new Date().toISOString(),
    };

    docs.push(newDoc);
    localStorage.setItem('aether_docs', JSON.stringify(docs));
    return newDoc;
  },

  async deleteDocument(id: string): Promise<void> {
    const docs = await this.getDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    localStorage.setItem('aether_docs', JSON.stringify(filtered));
  },
};
