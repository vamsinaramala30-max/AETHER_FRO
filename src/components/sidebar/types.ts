import React from 'react';

export interface NavSubItem {
  id?: string;
  label: string;
  href: string;
  badge?: string | number;
}

export interface NavSectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  items?: NavSubItem[];
}

export interface NavGroup {
  id: string;
  groupLabel?: string;
  items: NavSectionItem[];
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;

  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  onWeatherOpen?: () => void;

  unreadCount: number;
}
