import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-zinc-800/60 bg-[#030712] text-zinc-300"
      aria-label="AETHER footer"
    >
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Brand + Mission */}
            <div className="max-w-md">
              <Link
                to="/"
                aria-label="AETHER home"
                className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#030712]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                  <span className="text-lg font-bold text-white">A</span>
                </span>
                <span className="text-xl font-bold tracking-[0.3em] text-white">AETHER</span>
              </Link>

              <p className="mt-4 text-xs leading-relaxed text-zinc-400 sm:text-sm sm:leading-6">
                Your AI workspace that plans your day, manages projects, and sharpens how you think
                through real-task problem-solving.
              </p>

              <div className="mt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  Free during beta
                </span>
              </div>
            </div>

            {/* Quick Links & Contact */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
              {/* Legal & Policy Links */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Legal & Trust
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
                    >
                      <Shield className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/complaint"
                      className="inline-flex items-center gap-2 text-xs text-rose-400 transition-colors hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 sm:text-sm"
                    >
                      <Shield className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                      Report a Problem / Complaint
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Direct Contact */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Support & Contact
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
                    >
                      <Mail className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      Contact Form
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      className="inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      Help Center & FAQs
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:vkgroups127@gmail.com"
                      className="inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
                    >
                      <Mail className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      vkgroups127@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 border-t border-zinc-800/80 pt-6 text-xs text-zinc-400 sm:flex sm:items-center sm:justify-between">
            <p>&copy; {currentYear} AETHER. All rights reserved.</p>
            <p className="mt-2 text-zinc-400 sm:mt-0">
              Personal AI Workspace & Cognitive Problem-Solving Hub
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
