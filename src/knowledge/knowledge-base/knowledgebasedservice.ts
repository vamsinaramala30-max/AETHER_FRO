import { KnowledgeNode } from '../types';
import { notesService } from '../notes/noteservice';
import { documentsService } from '../documents/documentservice';

export const knowledgeBaseService = {
  async getGraphData(): Promise<KnowledgeNode[]> {
    try {
      const res = await fetch('/api/v1/knowledge/graph');
      const data = await res.json();
      if (data.success && Array.isArray(data.nodes) && data.nodes.length > 0) {
        return data.nodes;
      }
    } catch {
      // Fallback to local computation
    }

    const notes = await notesService.getNotes();
    const docs = await documentsService.getDocuments();

    const nodes: KnowledgeNode[] = [];

    notes.forEach((note: import('../types').Note) => {
      nodes.push({
        id: note.id,
        label: note.title,
        type: 'note',
        connections: note.tags,
      });
    });

    docs.forEach((doc: import('../types').DocumentItem) => {
      nodes.push({
        id: doc.id,
        label: doc.name,
        type: 'document',
        connections: doc.tags,
      });
    });

    const uniqueTags = Array.from(
      new Set([
        ...notes.flatMap((n: import('../types').Note) => n.tags || []),
        ...docs.flatMap((d: import('../types').DocumentItem) => d.tags || []),
      ]),
    );

    uniqueTags.forEach((tag) => {
      nodes.push({
        id: tag,
        label: `#${tag}`,
        type: 'concept',
        connections: [],
      });
    });

    return nodes;
  },
};
