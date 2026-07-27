import { aiApi, AiChatPayload, AiChatResponse, AiModelDTO } from '../api/Index';

export class AiService {
  public async sendMessage(payload: AiChatPayload): Promise<AiChatResponse> {
    return aiApi.sendMessage(payload);
  }

  public async *streamMessage(payload: AiChatPayload): AsyncGenerator<string, void, unknown> {
    yield* aiApi.streamMessage(payload);
  }

  public async getAvailableModels(): Promise<AiModelDTO[]> {
    return aiApi.getModels();
  }
}

export const aiService = new AiService();
