import { Message, Conversation } from './assistanttype';

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateConversationTitle = (firstMessage: string): string => {
  if (!firstMessage || firstMessage.trim().length === 0) {
    return 'New Conversation';
  }
  const cleaned = firstMessage.trim().replace(/\s+/g, ' ');
  return cleaned.length > 35 ? `${cleaned.substring(0, 35)}...` : cleaned;
};

export const formatRelativeTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const estimateTokenCount = (text: string): number => {
  if (!text) return 0;
  return Math.ceil(text.trim().length / 4);
};

export const trimContextWindow = (messages: Message[], maxTokens = 4000): Message[] => {
  let currentTokens = 0;
  const result: Message[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const tokens = msg.tokens?.total || estimateTokenCount(msg.content);
    if (currentTokens + tokens > maxTokens) break;
    currentTokens += tokens;
    result.unshift(msg);
  }

  return result;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const groupMessagesByDate = (
  conversations: Conversation[],
): Record<string, Conversation[]> => {
  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysStart = todayStart - 86400000 * 7;

  conversations.forEach((conv) => {
    if (conv.updatedAt >= todayStart) {
      groups.Today.push(conv);
    } else if (conv.updatedAt >= yesterdayStart) {
      groups.Yesterday.push(conv);
    } else if (conv.updatedAt >= sevenDaysStart) {
      groups['Previous 7 Days'].push(conv);
    } else {
      groups.Older.push(conv);
    }
  });

  return groups;
};

export const STORAGE_KEYS = {
  CONVERSATIONS: 'aether_assistant_conversations',
  ACTIVE_ID: 'aether_assistant_active_id',
  DRAFTS: 'aether_assistant_drafts',
};
