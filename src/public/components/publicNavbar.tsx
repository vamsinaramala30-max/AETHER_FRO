import React, { useState, useEffect, useRef } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/features' },
  { label: 'AI Platform', href: '/ai' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Focus', href: '/privacy' },
  { label: 'Security', href: '/security' }
];

export const PublicNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle mobile menu
  const toggleMenu = () => { setIsOpen((prev) => !prev); };

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0D12]/80 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-zinc-100 font-semibold tracking-wider text-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] rounded-md px-2 py-1"
            aria-label="Aether Homepage"
          >
            AETHER
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Public Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] rounded px-1.5 py-0.5"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/signin"
            className="text-sm font-medium text-zinc-300 hover:text-zinc-100 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded-md"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
          >
            Create account
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="p-2 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded-md"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Toggle main menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        id="mobile-navigation-menu"
        ref={menuRef}
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden bg-[#0D0F16] border-b border-zinc-800 px-4 pt-2 pb-6 space-y-3 transition-all duration-200`}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => { setIsOpen(false); }}
              className="block text-zinc-400 hover:text-zinc-200 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded px-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="pt-4 border-t border-zinc-800/60 flex flex-col gap-3">
          <a
            href="/signin"
            onClick={() => { setIsOpen(false); }}
            className="w-full text-center text-zinc-300 hover:text-zinc-100 py-2 text-base font-medium border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Sign in
          </a>
          <a
            href="/signup"
            onClick={() => { setIsOpen(false); }}
            className="w-full text-center bg-zinc-100 text-zinc-950 hover:bg-zinc-200 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Create account
          </a>
        </div>
      </div>
    </header>
  );
};