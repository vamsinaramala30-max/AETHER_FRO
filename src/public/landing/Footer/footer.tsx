import React from 'react';
import { Link } from 'react-router-dom';

interface FooterLink {
  label: string;
  href: string;
}

const PRODUCT_LINKS: FooterLink[] = [
  { label: 'Features', href: '/features' },
  { label: 'AI Platform', href: '/ai' },
  { label: 'Security', href: '/security' },
  { label: 'Privacy Focus', href: '/privacy' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Help Center', href: '/help' },
  { label: 'System States', href: '/states' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 bg-[#030712] text-zinc-300"
      aria-label="AETHER footer"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer card */}
        <div className="py-12 sm:py-16">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
            {/* Brand + CTA */}
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Brand */}
              <div>
                <Link
                  to="/"
                  aria-label="AETHER home"
                  className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030712] rounded-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                    <span className="text-xl font-bold text-white">A</span>
                  </span>

                  <span className="text-xl font-bold tracking-[0.3em] text-white">
                    AETHER
                  </span>
                </Link>

                <h2 className="mt-6 max-w-lg text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Build a more intelligent{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    digital workspace.
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                  AETHER brings AI, productivity, knowledge, automation, and
                  collaboration together in one intelligent platform.
                </p>

                {/* Status */}
                <Link
                  to="/states"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  All systems operational
                </Link>
              </div>

              {/* Contact CTA */}
              <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-black/20 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  Have a question?
                </p>

                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  Let&apos;s build something intelligent.
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Reach out for product questions, technical support,
                  partnerships, feedback, or business enquiries.
                </p>

                <Link
                  to="/contact"
                  className="group mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030712]"
                >
                  Contact AETHER
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="my-10 h-px bg-white/10" />

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <FooterColumn title="Product" links={PRODUCT_LINKS} />
              <FooterColumn title="Company" links={COMPANY_LINKS} />
              <FooterColumn title="Resources" links={RESOURCE_LINKS} />
              <FooterColumn title="Legal" links={LEGAL_LINKS} />
            </div>

            {/* Bottom */}
            <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-zinc-500">
                  © {currentYear} Aether Systems. All rights reserved.
                </p>

                <p className="mt-1 text-xs text-indigo-400/80">
                  Engineered for a smarter tomorrow.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  to="/privacy-policy"
                  className="text-xs text-zinc-500 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/terms"
                  className="text-xs text-zinc-500 transition-colors hover:text-white"
                >
                  Terms
                </Link>

                <Link
                  to="/contact"
                  className="text-xs text-zinc-500 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              to={link.href}
              className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;