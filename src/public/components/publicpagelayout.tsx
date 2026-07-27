import React from 'react';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0D12] font-sans text-zinc-100 antialiased selection:bg-zinc-700 selection:text-zinc-100">
      {/* Main Semantic Core */}
      <main id="main-public-content" className="flex-grow outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};
