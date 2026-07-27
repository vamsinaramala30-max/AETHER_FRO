import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/authprovider';

export interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/features' },
  { label: 'AI Platform', href: '/ai' },
  { label: 'About', href: '/about' },
  { label: 'Privacy Focus', href: '/privacy' },
  { label: 'Security', href: '/security' },
  { label: 'System States', href: '/states' },
];

export const PublicNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, logout } = useAuth();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800/60 bg-[#0B0D12]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="rounded-md px-2 py-1 text-lg font-semibold tracking-wider text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
            aria-label="Aether Homepage"
          >
            AETHER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main Public Navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded px-1.5 py-0.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/app"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  void logout();
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="rounded-md p-2 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
        } space-y-3 border-b border-zinc-800 bg-[#0D0F16] px-4 pb-6 pt-2 transition-all duration-200 md:hidden`}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                setIsOpen(false);
              }}
              className="block rounded px-2 py-2 text-base font-medium text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/app"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full rounded-md bg-indigo-600 py-2 text-center text-base font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  void logout();
                }}
                className="w-full rounded-md border border-zinc-700 py-2 text-center text-base font-medium text-zinc-400 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full rounded-md border border-zinc-700 py-2 text-center text-base font-medium text-zinc-300 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full rounded-md bg-zinc-100 py-2 text-center text-base font-medium text-zinc-950 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
