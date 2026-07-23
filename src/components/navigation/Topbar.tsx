import React from 'react';

export interface TopbarProps {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, leftAction, rightAction, children }) => {
  return (
    <header className="h-16 w-full bg-surface-base/80 backdrop-blur-md border-b border-border-subtle px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {leftAction}
        {title && <h1 className="text-base font-semibold text-text-primary">{title}</h1>}
      </div>
      {children && <div className="flex-grow max-w-xl mx-8">{children}</div>}
      <div className="flex items-center space-x-3">{rightAction}</div>
    </header>
  );
};