import { ChatMessageDTO } from '../api';
import { storageService } from './storageService';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessageDTO[];
  createdAt: number;
}

export class ChatService {
  private key = 'chat_sessions';

  public getSessions(): ChatSession[] {
    return storageService.get<ChatSession[]>(this.key, []);
  }

  public saveSession(session: ChatSession): void {
    const sessions = this.getSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    storageService.set(this.key, sessions);
  }

  public deleteSession(id: string): void {
    const sessions = this.getSessions().filter((s) => s.id !== id);
    storageService.set(this.key, sessions);
  }
}

export const chatService = new ChatService();
