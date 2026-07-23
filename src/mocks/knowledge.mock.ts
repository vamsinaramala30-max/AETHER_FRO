export interface MockKnowledgeDocument {
  id: string;
  title: string;
  type: 'pdf' | 'markdown' | 'txt';
  sizeBytes: number;
}

export const mockKnowledgeDocs: MockKnowledgeDocument[] = [
  { id: 'doc_1', title: 'AETHER_Architecture_Spec.pdf', type: 'pdf', sizeBytes: 2048576 },
  { id: 'doc_2', title: 'Telemetry_and_Observability.md', type: 'markdown', sizeBytes: 12048 },
];