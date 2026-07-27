import React from 'react';
import { Dropdown, DropdownItem } from '../ui/dropdown';
import { Avatar } from '../ui/avatar';

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
  onSettings: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onSettings }) => {
  const items: DropdownItem[] = [
    { id: 'settings', label: 'Settings', icon: '⚙️', onClick: onSettings },
    { id: 'logout', label: 'Logout', icon: '🚪', danger: true, onClick: onLogout },
  ];

  return (
    <Dropdown
      items={items}
      trigger={
        <button className="hover:bg-surface-hover flex items-center space-x-3 rounded-xl p-1 transition-colors">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="hidden text-left sm:block">
            <p className="text-text-primary text-xs font-semibold leading-tight">{user.name}</p>
            <p className="text-text-tertiary text-[10px] leading-tight">{user.email}</p>
          </div>
        </button>
      }
    />
  );
};
