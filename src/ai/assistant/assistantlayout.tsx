import React from 'react';
import { ChatSidebar } from './chatsidebar';
import { EmptyState } from './emptystate';
import { ErrorState } from './errorstate';
import { useAssistantState, useAssistantActions, useActiveConversation, useAutoScroll } from './assistanthooks';
import { ChatWindow } from './chatwindows';
import { ChatInput } from './chatinput';
import { AssistantHeader } from './assistantheader';

export const AssistantLayout: React.FC<{ header?: React.ReactNode; sidebar?: React.ReactNode; children?: React.ReactNode }> = ({ header, sidebar, children }) => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      {sidebar}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {header}
        {children}
      </main>
    </div>
  );
};
