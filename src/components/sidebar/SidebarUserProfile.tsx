import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';
import { SidebarTooltip } from './SidebarTooltip';

interface SidebarUserProfileProps {
  collapsed: boolean;
  isMobile?: boolean;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  collapsed,
  isMobile = false,
}) => {
  const { user, logout } = useAuth();

  const displayName =
    (user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.name || user?.email?.split('@')[0]) || 'User';

  const userEmail = user?.email || 'user@aether.ai';
  const initial = displayName[0]?.toUpperCase() || 'U';
  const userRole = (user as { role?: string })?.role || 'Admin';

  if (collapsed && !isMobile) {
    return (
      <div className="flex justify-center p-2">
        <SidebarTooltip content={`${displayName} (${userEmail})`}>
          <div className="group relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => void logout()}
              title="Sign out"
              aria-label="Sign out"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-500 font-bold text-white shadow-md transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span className="text-sm font-bold group-hover:hidden">{initial}</span>
              <LogOut className="hidden h-4 w-4 text-white group-hover:block" />
            </button>
          </div>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="border-aether-border/70 bg-aether-subtle/50 hover:bg-aether-hover/60 group relative flex items-center gap-3 rounded-2xl border p-2.5 shadow-sm transition-all duration-200 hover:border-aether-border">
        {/* Avatar */}
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-500 text-xs font-bold text-white shadow-sm ring-2 ring-white/10">
          <span>{initial}</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-aether-surface" />
        </div>

        {/* User Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold tracking-tight text-aether-main">
              {displayName}
            </p>
            <span className="py-0.2 rounded bg-indigo-500/15 px-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {userRole}
            </span>
          </div>
          <p className="truncate text-xs text-aether-muted">{userEmail}</p>
        </div>

        {/* Logout Button Aligned Right Inside Card */}
        <SidebarTooltip content="Sign out">
          <button
            type="button"
            onClick={() => void logout()}
            aria-label="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-aether-muted transition-colors hover:bg-red-500/10 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </SidebarTooltip>
      </div>
    </div>
  );
};
