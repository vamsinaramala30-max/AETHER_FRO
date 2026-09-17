import React from 'react';
import { Link } from 'react-router-dom';

export const AppFooter: React.FC = () => {
  return (
    <footer
      aria-label="Application footer"
      className="border-aether-border/60 bg-aether-surface/40 border-t px-4 py-3 text-xs text-aether-muted backdrop-blur-sm transition-colors sm:px-6"
    >
      <div className="mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* Navigation Links */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            to="/app"
            className="rounded px-1 py-0.5 font-medium text-aether-muted transition-colors hover:text-aether-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            AETHER OS
          </Link>
          <span className="text-aether-muted/40 select-none">·</span>
          <Link
            to="/privacy"
            className="rounded px-1 py-0.5 transition-colors hover:text-aether-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            Privacy
          </Link>
          <span className="text-aether-muted/40 select-none">·</span>
          <Link
            to="/terms"
            className="rounded px-1 py-0.5 transition-colors hover:text-aether-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            Terms
          </Link>
          <span className="text-aether-muted/40 select-none">·</span>
          <Link
            to="/help"
            className="rounded px-1 py-0.5 transition-colors hover:text-aether-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            Help
          </Link>
          <span className="text-aether-muted/40 select-none">·</span>
          <Link
            to="/contact"
            className="rounded px-1 py-0.5 transition-colors hover:text-aether-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-aether-muted/70 select-none text-[11px] font-medium tracking-wide">
          © 2026 AETHER
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
