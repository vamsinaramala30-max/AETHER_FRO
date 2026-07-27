import React from 'react';

export interface TopbarProps {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, leftAction, rightAction, children }) => {
  return (
    <header className="bg-surface-base/80 border-border-subtle sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-6 backdrop-blur-md">
      <div className="flex items-center space-x-4">
        {leftAction}
        {title && <h1 className="text-text-primary text-base font-semibold">{title}</h1>}
      </div>
      {children && <div className="mx-8 max-w-xl flex-grow">{children}</div>}
      <div className="flex items-center space-x-3">{rightAction}</div>
    </header>
  );
};
