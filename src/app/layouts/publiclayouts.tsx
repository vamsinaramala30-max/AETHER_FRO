import React from 'react';
import { Outlet } from 'react-router-dom';
// Integrating existing elements in the public tree safely
import { PublicNavbar } from '../../public/components/publicNavbar';
import { Footer } from '../../public/landing/Footer/footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground tracking-tight antialiased">
      <PublicNavbar />
      <main id="main-content" className="flex-grow w-full focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};