import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NavSectionItem } from './types';
import { SidebarTooltip } from './SidebarTooltip';

interface SidebarNavItemProps {
  item: NavSectionItem;
  collapsed: boolean;
  onMobileClose?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  collapsed,
  onMobileClose,
}) => {
  const location = useLocation();

  const isChildActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  const hasChildren = item.items && item.items.length > 0;

  const isAnyChildActive = hasChildren ? item.items!.some((sub) => isChildActive(sub.href)) : false;

  const isRootActive =
    location.pathname === item.href ||
    (item.id === 'home' && location.pathname === '/app') ||
    (item.href !== '/app' && location.pathname.startsWith(item.href) && !hasChildren);

  const isActive = isAnyChildActive || isRootActive;

  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  // Collapsed view rendering
  if (collapsed) {
    return (
      <div className="flex justify-center py-0.5">
        <SidebarTooltip content={item.label}>
          <Link
            to={item.href}
            onClick={onMobileClose}
            aria-label={item.label}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? 'bg-indigo-500/15 font-semibold text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400'
                : 'hover:bg-aether-hover/80 text-aether-muted hover:text-aether-main'
            }`}
          >
            {isActive && (
              <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
          </Link>
        </SidebarTooltip>
      </div>
    );
  }

  // Expanded view rendering
  return (
    <div className="space-y-0.5">
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isActive
              ? 'bg-indigo-500/10 font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
              : 'hover:bg-aether-hover/70 text-aether-muted hover:text-aether-main'
          }`}
        >
          {isActive && (
            <span className="absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          )}

          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-aether-muted group-hover:text-aether-main'
            }`}
          >
            {item.icon}
          </span>

          <span className="flex-1 truncate text-left text-sm">{item.label}</span>

          {item.badge && (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
              {item.badge}
            </span>
          )}

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-aether-muted transition-transform duration-200 group-hover:text-aether-main ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        <Link
          to={item.href}
          onClick={onMobileClose}
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isRootActive
              ? 'bg-indigo-500/10 font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
              : 'hover:bg-aether-hover/70 text-aether-muted hover:text-aether-main'
          }`}
        >
          {isRootActive && (
            <span className="absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          )}

          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 ${
              isRootActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-aether-muted group-hover:text-aether-main'
            }`}
          >
            {item.icon}
          </span>

          <span className="flex-1 truncate text-sm">{item.label}</span>

          {item.badge && (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
              {item.badge}
            </span>
          )}
        </Link>
      )}

      {/* Submenu Accordion */}
      {hasChildren && isOpen && (
        <div className="border-aether-border/60 relative ml-4 mt-0.5 space-y-0.5 border-l pl-3 transition-all duration-200">
          {item.items!.map((sub) => {
            const isSubActive = isChildActive(sub.href);
            return (
              <Link
                key={sub.href}
                to={sub.href}
                onClick={onMobileClose}
                className={`relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSubActive
                    ? 'bg-indigo-500/10 font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                    : 'hover:bg-aether-hover/60 text-aether-muted hover:text-aether-main'
                }`}
              >
                {isSubActive && (
                  <span className="absolute -left-3 bottom-2 top-2 w-0.5 rounded-full bg-indigo-500" />
                )}
                <span className="truncate">{sub.label}</span>
                {sub.badge && (
                  <span className="rounded-full bg-aether-subtle px-1.5 py-0.5 text-[9px] font-bold text-aether-muted">
                    {sub.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
