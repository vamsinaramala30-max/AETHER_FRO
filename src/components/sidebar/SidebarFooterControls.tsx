import React from 'react';
import { Bell, Moon, Sun, Thermometer } from 'lucide-react';
import { useTheme } from '@/app/providers/themeprovider';

interface SidebarFooterControlsProps {
  collapsed: boolean;
  onWeatherOpen: () => void;
  onNotificationsOpen: () => void;
  unreadCount?: number;
  isMobile?: boolean;
}

export const SidebarFooterControls: React.FC<
  SidebarFooterControlsProps
> = ({
  collapsed,
  onWeatherOpen,
  onNotificationsOpen,
  unreadCount = 0,
<<<<<<< HEAD
=======
  isMobile = false,
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
}) => {
  const { resolvedTheme, setTheme } = useTheme();

  if (collapsed) {
    return (
      <div className="border-t border-aether-border px-2 py-3">
        <div className="flex flex-col items-center gap-2">
          {/* Weather */}
          <button
            type="button"
            onClick={onWeatherOpen}
            aria-label="Open Weather"
            title="Weather"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          >
            <Thermometer className="h-4 w-4 text-cyan-400" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={onNotificationsOpen}
            aria-label="Open Notifications"
            title="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          >
            <Bell className="h-4 w-4" />
<<<<<<< HEAD
=======
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-aether-surface">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </SidebarTooltip>
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Theme */}
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            aria-label="Toggle Theme"
            title="Toggle Theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-aether-border px-4 py-3">
      {/* CONTROLS label */}
      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-aether-muted">
        Controls
      </div>

<<<<<<< HEAD
      {/* Controls */}
      <div className="flex items-center justify-end gap-2">
        {/* Weather */}
        <button
          type="button"
          onClick={onWeatherOpen}
          aria-label="Open Weather"
          title="Weather"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-all duration-200 hover:bg-aether-hover hover:text-aether-main hover:shadow-sm"
        >
          <Thermometer className="h-5 w-5 text-cyan-400" />
        </button>
=======
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
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3

        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationsOpen}
          aria-label="Open Notifications"
          title="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-all duration-200 hover:bg-aether-hover hover:text-aether-main hover:shadow-sm"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* Theme */}
        <button
          type="button"
          onClick={() =>
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          }
          aria-label="Toggle Theme"
          title="Toggle Theme"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-aether-border bg-aether-subtle text-aether-muted transition-all duration-200 hover:bg-aether-hover hover:text-aether-main hover:shadow-sm"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-400" />
          )}
        </button>
      </div>
    </div>
  );
};