import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers/themeprovider';
import { SidebarTooltip } from './SidebarTooltip';

interface SidebarFooterControlsProps {
  collapsed: boolean;
  onNotificationsOpen: () => void;
  unreadCount?: number;
  isMobile?: boolean;
}

export const SidebarFooterControls: React.FC<SidebarFooterControlsProps> = ({
  collapsed,
  onNotificationsOpen,
  unreadCount = 0,
  isMobile = false,
}) => {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (collapsed && !isMobile) {
    return (
      <div className="flex flex-col items-center gap-1 py-1">
        {/* Notifications Icon Button */}
        <SidebarTooltip content="Notifications">
          <button
            type="button"
            onClick={onNotificationsOpen}
            aria-label="Open notifications"
            className="border-aether-border/60 bg-aether-subtle/50 relative flex h-9 w-9 items-center justify-center rounded-xl border text-aether-muted transition-all duration-150 hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-aether-surface">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </SidebarTooltip>

        {/* Theme Toggle Icon Button */}
        <SidebarTooltip content={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="border-aether-border/60 bg-aether-subtle/50 flex h-9 w-9 items-center justify-center rounded-xl border text-aether-muted transition-all duration-150 hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="border-aether-border/40 flex items-center justify-between border-t px-3 py-1.5">
      <span className="text-aether-muted/70 text-[11px] font-semibold uppercase tracking-wider">
        Controls
      </span>

      <div className="flex items-center gap-1.5">
        {/* Notifications Icon Button */}
        <SidebarTooltip content="Notifications">
          <button
            type="button"
            onClick={onNotificationsOpen}
            aria-label="Open notifications"
            className="border-aether-border/60 bg-aether-subtle/50 relative flex h-8 w-8 items-center justify-center rounded-lg border text-aether-muted transition-all hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-aether-surface">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </SidebarTooltip>

        {/* Theme Toggle Icon Button */}
        <SidebarTooltip content={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="border-aether-border/60 bg-aether-subtle/50 flex h-8 w-8 items-center justify-center rounded-lg border text-aether-muted transition-all hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
        </SidebarTooltip>
      </div>
    </div>
  );
};
