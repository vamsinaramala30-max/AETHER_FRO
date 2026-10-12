import { useEffect, useRef, useState, useCallback } from 'react';
import { socketClient, SocketEventHandler } from '../lib/socketClient';

interface UseSocketOptions {
  url?: string;
  workspaceId?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: any) => void;
  onMessage?: (event: any) => void;
}

export const useSocket = (options?: UseSocketOptions) => {
  const [isConnected, setIsConnected] = useState<boolean>(socketClient.isConnected());

  useEffect(() => {
    const raw = socketClient.connect();

    const handleConnect = () => {
      setIsConnected(true);
      options?.onOpen?.();
      if (options?.workspaceId) {
        socketClient.joinWorkspace(options.workspaceId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      options?.onClose?.();
    };

    const handleError = (err: any) => {
      options?.onError?.(err);
    };

    if (raw) {
      if (raw.connected) {
        setIsConnected(true);
        if (options?.workspaceId) {
          socketClient.joinWorkspace(options.workspaceId);
        }
      }
      raw.on('connect', handleConnect);
      raw.on('disconnect', handleDisconnect);
      raw.on('connect_error', handleError);
    }

    return () => {
      if (raw) {
        raw.off('connect', handleConnect);
        raw.off('disconnect', handleDisconnect);
        raw.off('connect_error', handleError);
      }
    };
  }, [options?.workspaceId]);

  const sendMessage = useCallback((event: string, payload: any) => {
    socketClient.emit(event, payload);
  }, []);

  return { isConnected, sendMessage, socket: socketClient };
};

/**
 * React hook to listen to a realtime socket event with automatic cleanup on unmount.
 */
export const useRealtimeEvent = (event: string, handler: SocketEventHandler) => {
  const handlerRef = useRef<SocketEventHandler>(handler);
  handlerRef.current = handler;

  useEffect(() => {
    socketClient.connect();

    const listener: SocketEventHandler = (data) => {
      handlerRef.current(data);
    };

    socketClient.on(event, listener);

    return () => {
      socketClient.off(event, listener);
    };
  }, [event]);
};

