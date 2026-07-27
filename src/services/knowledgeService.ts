import { knowledgeApi, KnowledgeDocumentDTO } from '../api/Index';

export class KnowledgeService {
  public async searchDocs(query: string): Promise<KnowledgeDocumentDTO[]> {
    return knowledgeApi.search({ query });
  }

  public async getDoc(id: string): Promise<KnowledgeDocumentDTO> {
    return knowledgeApi.getById(id);
  }
}

export const knowledgeService = new KnowledgeService();
