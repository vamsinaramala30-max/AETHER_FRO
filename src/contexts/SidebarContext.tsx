import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';

export interface SidebarContextValue {
  isVisible: boolean;
  isCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  toggleVisibility: () => void;
  toggleCollapse: () => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);
  const toggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen((prev) => !prev);
  }, []);
  const setMobileDrawerOpen = useCallback((open: boolean) => {
    setIsMobileDrawerOpen(open);
  }, []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      isVisible,
      isCollapsed,
      isMobileDrawerOpen,
      toggleVisibility,
      toggleCollapse,
      toggleMobileDrawer,
      setMobileDrawerOpen,
    }),
    [
      isVisible,
      isCollapsed,
      isMobileDrawerOpen,
      toggleVisibility,
      toggleCollapse,
      toggleMobileDrawer,
      setMobileDrawerOpen,
    ],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
