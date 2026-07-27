import { BaseEntity } from './common';

export type DocumentType = 'pdf' | 'docx' | 'txt' | 'markdown' | 'url';

export interface KnowledgeDocument extends BaseEntity {
  title: string;
  type: DocumentType;
  fileSize: number; // in bytes
  fileUrl: string;
  vectorStatus: 'pending' | 'indexing' | 'indexed' | 'failed';
  chunkCount: number;
}
