import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  status,
  className = ''
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const statusColors = {
    online: 'bg-status-success',
    offline: 'bg-text-tertiary',
    away: 'bg-status-warning',
    busy: 'bg-status-error'
  };

  const getInitials = (n: string) => {
    return n.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div className={`rounded-full overflow-hidden flex items-center justify-center bg-surface-hover font-semibold text-text-primary border border-border-subtle ${sizes[size]} ${className}`}>
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name) || 'A'}</span>
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 rounded-full border-2 border-surface-base w-2.5 h-2.5 ${statusColors[status]}`} />
      )}
    </div>
  );
};