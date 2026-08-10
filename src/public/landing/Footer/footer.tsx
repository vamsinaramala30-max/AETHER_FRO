import React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'AI Platform', href: '/ai' },
  { label: 'Privacy Focus', href: '/privacy' },
  { label: 'Security Architecture', href: '/security' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export const Footer: React.FC = () => {
  const absoluteCurrentYear = 2026;

  return (
    <footer className="border-t border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-slate-100/60 backdrop-blur-md py-10 sm:py-12" aria-label="Aether Site Footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <span className="block text-sm font-semibold tracking-wider text-zinc-100 dark:text-zinc-100 light:text-zinc-900">AETHER</span>
          <span className="mt-1 block text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
            © {absoluteCurrentYear} Aether Systems. All computational rights reserved.
          </span>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
          aria-label="Footer Quick Links"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded px-1.5 py-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 transition-colors hover:text-zinc-100 dark:hover:text-zinc-100 light:hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
