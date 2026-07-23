// frontend/src/knowledge/search/searchService.ts
import { SearchResult } from '../types';
import { notesService } from '../notes/notesService';
import { documentsService } from '../documents/documentsService';

export const searchService = {
  async queryAll(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const notes = await notesService.getNotes();
    const docs = await documentsService.getDocuments();
    const results: SearchResult[] = [];
    const q = query.toLowerCase();

    notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          id: n.id,
          type: 'note',
          title: n.title,
          snippet: n.content.substring(0, 140) + (n.content.length > 140 ? '...' : ''),
          score: n.title.toLowerCase().includes(q) ? 1.2 : 0.8,
          date: n.updatedAt,
        });
      }
    });

    docs.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          id: d.id,
          type: 'document',
          title: d.name,
          snippet: `File size: ${(d.size / 1024).toFixed(1)} KB | Type: ${d.mimeType}`,
          score: d.name.toLowerCase().includes(q) ? 1.1 : 0.7,
          date: d.createdAt,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  },
};