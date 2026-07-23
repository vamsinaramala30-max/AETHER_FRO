import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';

export interface ModalInstance<P = Record<string, unknown>> {
  id: string;
  componentName: string;
  payload?: P;
}

export interface ModalContextValue {
  modalStack: ModalInstance[];
  openModal: <P>(componentName: string, payload?: P) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  const openModal = useCallback(<P,>(componentName: string, payload?: P): string => {
    const id = `modal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newModal: ModalInstance = { id, componentName, payload: payload as Record<string, unknown> };
    setModalStack((prev) => [...prev, newModal]);
    return id;
  }, []);

  const closeModal = useCallback((id?: string) => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      if (!id) return prev.slice(0, -1);
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
    [modalStack, openModal, closeModal, closeAllModals]
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