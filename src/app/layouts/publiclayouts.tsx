import React from 'react';
import { Outlet } from 'react-router-dom';
// Integrating existing elements in the public tree safely
import { PublicNavbar } from '../../public/components/publicNavbar';
import { Footer } from '../../public/landing/Footer/footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col tracking-tight antialiased">
      <PublicNavbar />
      <main id="main-content" className="w-full flex-grow focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
