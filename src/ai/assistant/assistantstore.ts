import { AssistantState, Conversation, Message } from './assistanttype';
import { generateUUID, generateConversationTitle, STORAGE_KEYS } from './assistantutils';
import { assistantService } from './assistantservice';

type Listener = () => void;

class AssistantStore {
  private state: AssistantState = {
    conversations: {},
    activeConversationId: null,
    isStreaming: false,
    isTyping: false,
    isLoading: false,
    error: null,
    searchQuery: '',
    sidebarOpen: true,
    abortController: null,
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  public getState(): AssistantState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => { listener(); });
  }

  private setState(partialState: Partial<AssistantState>): void {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.state.conversations));
      if (this.state.activeConversationId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, this.state.activeConversationId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      }
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }

  private loadFromStorage(): void {
    try {
      const storedConvs = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);

      const conversations: Record<string, Conversation> = storedConvs ? JSON.parse(storedConvs) : {};
      const activeConversationId = storedActiveId && conversations[storedActiveId] ? storedActiveId : null;

      this.state = {
        ...this.state,
        conversations,
        activeConversationId,
      };
    } catch (err) {
      console.error('Failed to load state from localStorage:', err);
    }
  }

  public createConversation = (): string => {
    const id = generateUUID();
    const now = Date.now();

    const newConversation: Conversation = {
      id,
      title: 'New Conversation',
      createdAt: now,
      updatedAt: now,
      messages: [],
      metadata: {},
    };

    this.setState({
      conversations: { ...this.state.conversations, [id]: newConversation },
      activeConversationId: id,
    });

    this.saveToStorage();
    return id;
  };

  public setActiveConversation = (id: string | null): void => {
    if (id && !this.state.conversations[id]) return;
    this.setState({ activeConversationId: id });
    this.saveToStorage();
  };

  public deleteConversation = (id: string): void => {
    const updated = { ...this.state.conversations };
    delete updated[id];

    let nextActiveId = this.state.activeConversationId;
    if (nextActiveId === id) {
      const remainingIds = Object.keys(updated);
      nextActiveId = remainingIds.length > 0 ? remainingIds[0] : null;
    }

    this.setState({
      conversations: updated,
      activeConversationId: nextActiveId,
    });

    this.saveToStorage();
  };

  public renameConversation = (id: string, title: string): void => {
    const conv = this.state.conversations[id];
    if (!conv) return;

    const updatedConv: Conversation = {
      ...conv,
      title,
      updatedAt: Date.now(),
    };

    this.setState({
      conversations: { ...this.state.conversations, [id]: updatedConv },
    });

    this.saveToStorage();
  };

  public setDraft = (id: string, draft: string): void => {
    const conv = this.state.conversations[id];
    if (!conv) return;

    this.setState({
      conversations: {
        ...this.state.conversations,
        [id]: { ...conv, draft },
      },
    });

    this.saveToStorage();
  };

  public setSearchQuery = (query: string): void => {
    this.setState({ searchQuery: query });
  };

  public toggleSidebar = (): void => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  public setSidebarOpen = (open: boolean): void => {
    this.setState({ sidebarOpen: open });
  };

  public cancelStreaming = (): void => {
    if (this.state.abortController) {
      this.state.abortController.abort();
    }
    this.setState({ isStreaming: false, isTyping: false, abortController: null });
  };

  public sendMessage = async (content: string): Promise<void> => {
    let activeId = this.state.activeConversationId;

    if (!activeId || !this.state.conversations[activeId]) {
      activeId = this.createConversation();
    }

    const conversation = this.state.conversations[activeId];
    const isFirstMessage = conversation.messages.length === 0;

    const userMessage: Message = {
      id: generateUUID(),
      conversationId: activeId,
      role: 'user',
      content,
      status: 'sent',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedTitle = isFirstMessage ? generateConversationTitle(content) : conversation.title;

    const updatedConversation: Conversation = {
      ...conversation,
      title: updatedTitle,
      updatedAt: Date.now(),
      draft: '',
      messages: [...conversation.messages, userMessage],
    };

    this.setState({
      conversations: { ...this.state.conversations, [activeId]: updatedConversation },
      isTyping: true,
      error: null,
    });
    this.saveToStorage();

    const assistantMessageId = generateUUID();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      conversationId: activeId,
      role: 'assistant',
      content: '',
      status: 'streaming',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.setState({
      conversations: {
        ...this.state.conversations,
        [activeId]: {
          ...updatedConversation,
          messages: [...updatedConversation.messages, initialAssistantMessage],
        },
      },
      isStreaming: true,
    });

    const abortController = new AbortController();
    this.setState({ abortController });

    try {
      await assistantService.sendMessage(
        activeId,
        content,
        { temperature: 0.7, model: 'default' }
      );

      this.finalizeAssistantMessage(activeId, assistantMessageId, 'delivered');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        this.finalizeAssistantMessage(activeId, assistantMessageId, 'sent');
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        this.setState({ error: errorMsg });
        this.finalizeAssistantMessage(activeId, assistantMessageId, 'error', errorMsg);
      }
    } finally {
      this.setState({ isStreaming: false, isTyping: false, abortController: null });
      this.saveToStorage();
    }
  };

  private appendToAssistantMessage(conversationId: string, messageId: string, chunk: string): void {
    const conv = this.state.conversations[conversationId];
    if (!conv) return;

    const messages = conv.messages.map((msg) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          content: msg.content + chunk,
          updatedAt: Date.now(),
        };
      }
      return msg;
    });

    this.setState({
      conversations: {
        ...this.state.conversations,
        [conversationId]: { ...conv, messages, updatedAt: Date.now() },
      },
    });
  }

  private finalizeAssistantMessage(
    conversationId: string,
    messageId: string,
    status: Message['status'],
    error?: string
  ): void {
    const conv = this.state.conversations[conversationId];
    if (!conv) return;

    const messages = conv.messages.map((msg) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status,
          error,
          updatedAt: Date.now(),
        };
      }
      return msg;
    });

    this.setState({
      conversations: {
        ...this.state.conversations,
        [conversationId]: { ...conv, messages, updatedAt: Date.now() },
      },
    });
  }

  public retryLastMessage = async (): Promise<void> => {
    const { activeConversationId, conversations } = this.state;
    if (!activeConversationId || !conversations[activeConversationId]) return;

    const conv = conversations[activeConversationId];
    const lastUserMsgIndex = [...conv.messages].reverse().findIndex((m) => m.role === 'user');

    if (lastUserMsgIndex === -1) return;

    const actualIndex = conv.messages.length - 1 - lastUserMsgIndex;
    const lastUserMessage = conv.messages[actualIndex];

    const trimmedMessages = conv.messages.slice(0, actualIndex);

    this.setState({
      conversations: {
        ...conversations,
        [activeConversationId]: {
          ...conv,
          messages: trimmedMessages,
        },
      },
    });

    await this.sendMessage(lastUserMessage.content);
  };

  public deleteMessage = (conversationId: string, messageId: string): void => {
    const conv = this.state.conversations[conversationId];
    if (!conv) return;

    const filtered = conv.messages.filter((m) => m.id !== messageId);

    this.setState({
      conversations: {
        ...this.state.conversations,
        [conversationId]: { ...conv, messages: filtered, updatedAt: Date.now() },
      },
    });

    this.saveToStorage();
  };
}

export const assistantStore = new AssistantStore();