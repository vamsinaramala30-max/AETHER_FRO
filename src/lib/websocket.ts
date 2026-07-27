import { logger } from './logger';

export type WSStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export interface WSConfig {
  url: string;
  heartbeatIntervalMs?: number;
  reconnectIntervalMs?: number;
  maxReconnectAttempts?: number;
}

export type MessageHandler<T = unknown> = (data: T) => void;

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private config: Required<WSConfig>;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WSConfig) {
    this.config = {
      url: config.url,
      heartbeatIntervalMs: config.heartbeatIntervalMs ?? 30000,
      reconnectIntervalMs: config.reconnectIntervalMs ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
    };
  }

  connect(): void {
    this.isIntentionallyClosed = false;
    try {
      this.socket = new WebSocket(this.config.url);
      this.bindEvents();
    } catch (err) {
      logger.error(
        'WebSocket connection initialization failed',
        err instanceof Error ? err : new Error(String(err)),
      );
      this.scheduleReconnect();
    }
  }

  private bindEvents(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      logger.info('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as Record<string, unknown>;
        const eventType =
          typeof parsed.type === 'string' && parsed.type.trim() !== '' ? parsed.type : 'message';
        const callbacks = this.handlers.get(eventType);
        callbacks?.forEach((cb) => {
          cb(parsed.payload ?? parsed);
        });
      } catch {
        const rawCallbacks = this.handlers.get('raw');
        rawCallbacks?.forEach((cb) => {
          cb(event.data);
        });
      }
    };

    this.socket.onclose = () => {
      this.stopHeartbeat();
      if (!this.isIntentionallyClosed) {
        logger.warn('WebSocket connection closed unexpectedly');
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      logger.error(
        'WebSocket error occurred',
        error instanceof Error ? error : new Error('WebSocket error event'),
      );
    };
  }

  on<T = unknown>(event: string, handler: MessageHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as MessageHandler);
  }

  off<T = unknown>(event: string, handler: MessageHandler<T>): void {
    this.handlers.get(event)?.delete(handler as MessageHandler);
  }

  send(event: string, payload: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: event, payload }));
    } else {
      logger.warn('Cannot send message: WebSocket is not in OPEN state.');
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send('ping', {});
    }, this.config.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.config.reconnectIntervalMs);
    } else {
      logger.error('WebSocket reconnect failed: Max retry limits reached.');
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();
    this.socket?.close();
    this.socket = null;
  }
}
