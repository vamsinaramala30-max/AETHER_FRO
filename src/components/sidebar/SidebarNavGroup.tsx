import React from 'react';
import { NavGroup } from './types';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarNavGroupProps {
  group: NavGroup;
  collapsed: boolean;
  onMobileClose?: () => void;
  isFirst?: boolean;
}

export const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({
  group,
  collapsed,
  onMobileClose,
  isFirst = false,
}) => {
  return (
    <div className={`space-y-1 ${!isFirst ? 'border-aether-border/40 mt-4 border-t pt-3' : ''}`}>
      {group.groupLabel && (
        <>
          {!collapsed ? (
            <div className="px-3 pb-1.5 pt-0.5">
              <span className="text-aether-muted/70 select-none text-[11px] font-semibold uppercase tracking-wider">
                {group.groupLabel}
              </span>
            </div>
          ) : (
            <div className="bg-aether-border/60 mx-auto my-1.5 h-px w-6" />
          )}
        </>
      )}

      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onMobileClose={onMobileClose}
          />
        ))}
      </div>
    </div>
  );
};
