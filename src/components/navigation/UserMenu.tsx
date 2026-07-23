import React from 'react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';

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
    { id: 'logout', label: 'Logout', icon: '🚪', danger: true, onClick: onLogout }
  ];

  return (
    <Dropdown
      items={items}
      trigger={
        <button className="flex items-center space-x-3 p-1 rounded-xl hover:bg-surface-hover transition-colors">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-text-primary leading-tight">{user.name}</p>
            <p className="text-[10px] text-text-tertiary leading-tight">{user.email}</p>
          </div>
        </button>
      }
    />
  );
};