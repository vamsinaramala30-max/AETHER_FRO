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
  { label: 'Privacy Policy', href: '/privacy-policy' }
];

export const Footer: React.FC = () => {
  const absoluteCurrentYear = 2026;

  return (
    <footer className="bg-[#0B0D12] border-t border-zinc-900 py-12" aria-label="Aether Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <span className="text-zinc-200 font-semibold tracking-wider text-sm block">AETHER</span>
          <span className="text-xs text-zinc-500 mt-1 block">
            © {absoluteCurrentYear} Aether Systems. All computational rights reserved.
          </span>
        </div>
        
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer Quick Links">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 rounded px-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};