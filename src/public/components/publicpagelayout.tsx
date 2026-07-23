import React from 'react';
import { PublicNavbar } from './publicNavbar';
import { Footer } from '../landing/Footer/footer';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-zinc-100 selection:bg-zinc-700 selection:text-zinc-100 flex flex-col font-sans antialiased">
      {/* Structural Skip Link for Accessibility */}
      <a
        href="#main-public-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-zinc-100 text-zinc-950 px-4 py-2 rounded-md font-medium z-50 outline-none ring-2 ring-zinc-500"
      >
        Skip to main content
      </a>

      {/* Shared Navigation Component */}
      <PublicNavbar />

      {/* Main Semantic Core */}
      <main id="main-public-content" className="flex-grow pt-16 outline-none" tabIndex={-1}>
        {children}
      </main>

      {/* Shared Footer Component */}
      <Footer />
    </div>
  );
};