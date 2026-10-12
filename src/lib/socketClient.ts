import { io, Socket } from 'socket.io-client';
import { authConfig } from '../config/auth.config';
import { env } from '../config/environment';

export type SocketEventHandler = (data: any) => void;

class RealtimeSocketClient {
  private socket: Socket | null = null;
  private currentWorkspaceId: string | null = null;
  private listeners: Map<string, Set<SocketEventHandler>> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnecting: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('aether_cross_tab_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && typeof event.data === 'object') {
            const { event: evtName, payload } = event.data;
            if (evtName) {
              this.dispatchLocal(evtName, payload, false);
            }
          }
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }
  }

  private getSocketUrl(): string {
    const rawApi = env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
    // Remove /api/v1 or /api to get base host
    return rawApi.replace(/\/api(\/v1)?\/?$/, '');
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(authConfig.tokenKey) ||
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      null
    );
  }

  public connect(customToken?: string): Socket | null {
    if (typeof window === 'undefined') return null;

    const token = customToken || this.getToken();
    if (!token) {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    this.isConnecting = true;
    const url = this.getSocketUrl();

    this.socket = io(url, {
      path: '/socket.io',
      auth: { token },
      query: { ...(this.currentWorkspaceId ? { workspaceId: this.currentWorkspaceId } : {}) },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log(`[AETHER Realtime] Connected to ${url} (Socket ID: ${this.socket?.id})`);

      // Re-join workspace if one was selected
      if (this.currentWorkspaceId) {
        this.socket?.emit('workspace:join', this.currentWorkspaceId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`[AETHER Realtime] Disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      this.isConnecting = false;
      console.warn(`[AETHER Realtime] Connection error: ${error.message}`);
    });

    // Wire wildcard / known domain events to listeners
    const CORE_EVENTS = [
      'task:created',
      'task:updated',
      'task:completed',
      'task:deleted',
      'task.created',
      'task.updated',
      'task.completed',
      'task.deleted',
      'planner:created',
      'planner:updated',
      'planner:deleted',
      'planner.created',
      'planner.updated',
      'planner.deleted',
      'calendar:created',
      'calendar:updated',
      'calendar:deleted',
      'calendar.created',
      'calendar.updated',
      'calendar.deleted',
      'focus:started',
      'focus:completed',
      'focus.started',
      'focus.completed',
      'notification:new',
      'notification:created',
      'notification.created',
      'workspace:member_added',
      'workspace:member_updated',
      'workspace:member_removed',
      'workspace:member_mutated',
      'workspace.member.added',
      'workspace.member.updated',
      'workspace.member.removed',
      'project:updated',
    ];

    CORE_EVENTS.forEach((evt) => {
      this.socket?.on(evt, (payload: any) => {
        this.dispatchLocal(evt, payload, true);
      });
    });

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  public joinWorkspace(workspaceId: string): void {
    this.currentWorkspaceId = workspaceId;
    if (this.socket?.connected) {
      this.socket.emit('workspace:join', workspaceId);
    } else {
      this.connect();
    }
  }

  public leaveWorkspace(workspaceId: string): void {
    if (this.currentWorkspaceId === workspaceId) {
      this.currentWorkspaceId = null;
    }
    if (this.socket?.connected) {
      this.socket.emit('workspace:leave', workspaceId);
    }
  }

  public on(event: string, handler: SocketEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Also register on underlying socket if active
    if (this.socket) {
      this.socket.on(event, (payload: any) => {
        handler(payload);
      });
    }
  }

  public off(event: string, handler: SocketEventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
    if (this.socket) {
      this.socket.off(event, handler as any);
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
    // Also notify other tabs locally
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ event, payload: data });
      } catch {
        // Ignore
      }
    }
  }

  private dispatchLocal(event: string, payload: any, broadcastToTabs: boolean): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(payload);
        } catch (err) {
          console.error(`Error in socket event handler for ${event}:`, err);
        }
      });
    }

    // Broadcast to other browser tabs
    if (broadcastToTabs && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ event, payload });
      } catch {
        // Ignore
      }
    }
  }

  public isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  public getRawSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = new RealtimeSocketClient();
