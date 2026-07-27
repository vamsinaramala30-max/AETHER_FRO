import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';

export interface ModalInstance {
  id: string;
  componentName: string;
  payload?: Record<string, unknown>;
}

export interface ModalContextValue {
  modalStack: ModalInstance[];
  openModal: (componentName: string, payload?: Record<string, unknown>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  const openModal = useCallback(
    (componentName: string, payload?: Record<string, unknown>): string => {
      const id = `modal_${String(Date.now())}_${Math.random().toString(36).substring(2, 7)}`;
      const newModal: ModalInstance = { id, componentName, payload };
      setModalStack((prev) => [...prev, newModal]);
      return id;
    },
    [],
  );

  const closeModal = useCallback((id?: string) => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      const hasId = typeof id === 'string' && id.trim() !== '';
      if (!hasId) return prev.slice(0, -1);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModalStack([]);
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      modalStack,
      openModal,
      closeModal,
      closeAllModals,
    }),
    [modalStack, openModal, closeModal, closeAllModals],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
