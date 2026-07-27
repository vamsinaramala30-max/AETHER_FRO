import React from 'react';

export const AssistantLayout: React.FC<{
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ header, sidebar, children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {sidebar}
      <main className="relative flex h-full min-w-0 flex-1 flex-col">
        {header}
        {children}
      </main>
    </div>
  );
};
