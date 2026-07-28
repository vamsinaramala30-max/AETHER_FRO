import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-background text-foreground flex min-h-screen overflow-hidden">
      {/* Structural Desktop Navigation Boundary Container */}
      <aside
        className="border-border bg-card hidden border-r md:flex md:w-64 md:flex-col"
        aria-label="Application Navigation"
      >
        <div className="flex flex-grow flex-col overflow-y-auto pt-5">
          {/* Future Sidebar Component Mount Point Slot */}
          <div className="flex flex-shrink-0 items-center px-4">
            <span className="text-primary text-xl font-bold uppercase tracking-wider">Aether</span>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {/* Future private nav links will render here */}
          </nav>
        </div>
      </aside>

      {/* Main Structural Framework Canvas */}
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <header className="border-border bg-card relative z-10 flex h-16 flex-shrink-0 border-b">
          {/* Mobile Hamburguer & App Shell Controls Boundary Slot */}
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold md:hidden">Aether</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile/System Theme Dropdowns Boundary */}
            </div>
          </div>
        </header>

        <main
          id="app-content"
          className="relative z-0 flex-1 overflow-y-auto p-6 focus:outline-none sm:p-8"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
