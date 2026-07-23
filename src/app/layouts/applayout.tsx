import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Structural Desktop Navigation Boundary Container */}
      <aside 
        className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card"
        aria-label="Application Navigation"
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Future Sidebar Component Mount Point Slot */}
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold tracking-wider uppercase text-primary">Aether</span>
          </div>
          <nav className="flex-1 px-2 mt-8 space-y-1">
            {/* Future private nav links will render here */}
          </nav>
        </div>
      </aside>

      {/* Main Structural Framework Canvas */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="relative z-10 flex flex-shrink-0 h-16 border-b border-border bg-card">
          {/* Mobile Hamburguer & App Shell Controls Boundary Slot */}
          <div className="flex flex-1 px-4 justify-between sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold md:hidden">Aether</h1>
            </div>
            <div className="flex items-center ml-4 md:ml-6">
              {/* Profile/System Theme Dropdowns Boundary */}
            </div>
          </div>
        </header>

        <main 
          id="app-content" 
          className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6 sm:p-8"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};