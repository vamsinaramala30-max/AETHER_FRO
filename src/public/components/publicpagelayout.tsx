import React from 'react';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-zinc-100 selection:bg-zinc-700 selection:text-zinc-100 flex flex-col font-sans antialiased">
      {/* Main Semantic Core */}
      <main id="main-public-content" className="flex-grow outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};
