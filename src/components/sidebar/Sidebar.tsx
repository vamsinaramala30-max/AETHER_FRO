import React from 'react';

import type { SidebarProps } from './types';
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
  unreadCount = 0,
}) => {
  const isCollapsed = collapsed && !isMobile;

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`relative z-30 flex h-full shrink-0 flex-col overflow-hidden border-r border-aether-border bg-aether-surface shadow-xl select-none transition-all duration-300 ease-in-out md:shadow-sm ${
        isMobile
          ? 'w-[280px]'
          : isCollapsed
            ? 'w-[72px]'
            : 'w-[280px]'
      }`}
    >
      <SidebarHeader
        collapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />

      <SidebarSearch
        collapsed={isCollapsed}
        onSearchOpen={onSearchOpen}
        isMobile={isMobile}
      />

      <nav
        aria-label="Main Navigation"
        className="scrollbar-thin flex-1 overflow-x-hidden overflow-y-auto px-2 py-2 transition-all duration-150"
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

      <SidebarFooterControls
        collapsed={isCollapsed}
        onWeatherOpen={onWeatherOpen}
        onNotificationsOpen={onNotificationsOpen}
        unreadCount={unreadCount}
        isMobile={isMobile}
      />

      <SidebarUserProfile
        collapsed={isCollapsed}
        isMobile={isMobile}
      />
    </aside>
  );
};

export default Sidebar;
