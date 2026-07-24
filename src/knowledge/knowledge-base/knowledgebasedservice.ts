// frontend/src/knowledge/knowledge-base/knowledgeBaseService.ts
import { KnowledgeNode } from '../types';
import { notesService } from '../notes/noteservice';
import { documentsService } from '../documents/documentservice';

export const knowledgeBaseService = {
  async getGraphData(): Promise<KnowledgeNode[]> {
    const notes = await notesService.getNotes();
    const docs = await documentsService.getDocuments();

    const nodes: KnowledgeNode[] = [];

    notes.forEach((note: import('../types').Note) => {
      nodes.push({
        id: note.id,
        label: note.title,
        type: 'note',
        connections: note.tags, // Connects to tag concepts
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

    // Extract unique tags as concept nodes
    const uniqueTags = Array.from(new Set([...notes.flatMap((n: import('../types').Note) => n.tags), ...docs.flatMap((d: import('../types').DocumentItem) => d.tags)]));
    
    uniqueTags.forEach((tag) => {
      nodes.push({
        id: tag,
        label: `#${tag}`,
        type: 'concept',
        connections: [], // Filled implicitly by items pointing to it
      });
    });

    return nodes;
  },
};