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
    <footer className="border-t border-zinc-900 bg-[#0B0D12] py-12" aria-label="Aether Site Footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <span className="block text-sm font-semibold tracking-wider text-zinc-200">AETHER</span>
          <span className="mt-1 block text-xs text-zinc-500">
            © {absoluteCurrentYear} Aether Systems. All computational rights reserved.
          </span>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Footer Quick Links"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded px-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
