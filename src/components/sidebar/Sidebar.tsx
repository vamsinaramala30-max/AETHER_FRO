import React from 'react';
import { SidebarProps } from './types';
import { navigationGroups } from './navConfig';
import { SidebarHeader } from './SidebarHeader';
import { SidebarSearch } from './SidebarSearch';
import { SidebarNavGroup } from './SidebarNavGroup';
import { SidebarFooterControls } from './SidebarFooterControls';
import { SidebarUserProfile } from './SidebarUserProfile';

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onMobileClose,
  isMobile = false,
  onSearchOpen,
  onNotificationsOpen,
  unreadCount,
}) => {
  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`relative flex h-full flex-col overflow-hidden border-r border-aether-border bg-aether-surface transition-all duration-300 ease-in-out ${
        isMobile ? 'w-[280px]' : collapsed ? 'w-[72px]' : 'w-[280px]'
      } z-30 shrink-0 select-none shadow-xl md:shadow-sm`}
    >
      {/* Header with logo & workspace selector */}
      <SidebarHeader
        collapsed={collapsed && !isMobile}
        onToggleCollapse={onToggleCollapse}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />

      {/* Global Command Palette Launcher */}
      <SidebarSearch
        collapsed={collapsed && !isMobile}
        onSearchOpen={onSearchOpen}
        isMobile={isMobile}
      />

      {/* Scrollable Navigation Area */}
      <nav
        className="scrollbar-thin flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 transition-all duration-150"
        aria-label="Main Navigation"
      >
        {navigationGroups.map((group, index) => (
          <SidebarNavGroup
            key={group.id}
            group={group}
            collapsed={collapsed && !isMobile}
            onMobileClose={onMobileClose}
            isFirst={index === 0}
          />
        ))}
      </nav>

      {/* Footer Controls (Notifications & Theme Toggle) */}
      <SidebarFooterControls
        collapsed={collapsed && !isMobile}
        onNotificationsOpen={onNotificationsOpen}
        unreadCount={unreadCount}
        isMobile={isMobile}
      />

      {/* User Profile Card with Integrated Logout */}
      <SidebarUserProfile collapsed={collapsed && !isMobile} isMobile={isMobile} />
    </aside>
  );
};
