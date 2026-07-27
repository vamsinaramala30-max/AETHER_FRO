import { useEffect, useRef, useState, useCallback } from 'react';

interface UseSocketOptions {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export const useSocket = ({ url, onOpen, onClose, onError, onMessage }: UseSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      onOpen?.();
    };

    ws.onclose = () => {
      setIsConnected(false);
      onClose?.();
    };

    ws.onerror = (e) => {
      onError?.(e);
    };

    ws.onmessage = (e) => {
      onMessage?.(e);
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url, onOpen, onClose, onError, onMessage]);

  const sendMessage = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
    }
  }, []);

  return { isConnected, sendMessage };
};
