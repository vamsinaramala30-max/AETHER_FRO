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
  onWeatherOpen,
  unreadCount,
}) => {
  const isCollapsed = collapsed && !isMobile;

  return (
    <aside
      aria-label="Sidebar Navigation"
<<<<<<< HEAD
      className={`relative z-30 flex h-full shrink-0 flex-col overflow-hidden border-r border-aether-border bg-aether-surface shadow-xl transition-all duration-300 ease-in-out select-none md:shadow-sm ${
=======
      className={`relative flex h-full flex-col overflow-hidden border-r border-aether-border bg-aether-surface transition-all duration-300 ease-in-out ${
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
        isMobile ? 'w-[280px]' : collapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Header with logo & workspace selector */}
      <SidebarHeader
        collapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />

      {/* Global Command Palette Launcher */}
      <SidebarSearch
        collapsed={isCollapsed}
        onSearchOpen={onSearchOpen}
        isMobile={isMobile}
      />

      {/* Scrollable Navigation Area */}
      <nav
        className="scrollbar-thin flex-1 overflow-x-hidden overflow-y-auto px-2 py-2 transition-all duration-150"
        aria-label="Main Navigation"
      >
        {navigationGroups.map((group, index) => (
          <SidebarNavGroup
            key={group.id}
            group={group}
            collapsed={isCollapsed}
            onMobileClose={onMobileClose}
            isFirst={index === 0}
          />
        ))}
      </nav>

      {/* Footer Controls */}
      <SidebarFooterControls
        collapsed={isCollapsed}
        onWeatherOpen={onWeatherOpen}
        onNotificationsOpen={onNotificationsOpen}
        unreadCount={unreadCount}
        isMobile={isMobile}
      />

      {/* User Profile Card with Integrated Logout */}
      <SidebarUserProfile
        collapsed={isCollapsed}
        isMobile={isMobile}
      />
    </aside>
  );
};