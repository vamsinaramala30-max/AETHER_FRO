import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

interface SecurityItem {
  title: string;
  category: string;
  status: 'IMPLEMENTED' | 'PLANNED' | 'BEST PRACTICE';
  details: string;
}

const SECURITY_ITEMS: SecurityItem[] = [
  {
    title: 'Transport Layer Security (TLS 1.3)',
    category: 'Network Security',
    status: 'IMPLEMENTED',
    details:
      'All incoming HTTP requests and WebSocket connections enforce modern TLS 1.3 protocol standards with strong cipher suites.',
  },
  {
    title: 'Salted Password Hashing (Argon2id / Bcrypt)',
    category: 'Authentication',
    status: 'IMPLEMENTED',
    details:
      'User passwords are cryptographically salted and hashed using modern key derivation functions before persistence in PostgreSQL.',
  },
  {
    title: 'JWT Session Security & HttpOnly Cookies',
    category: 'Authentication',
    status: 'IMPLEMENTED',
    details:
      'Authentication state relies on cryptographically signed JWT tokens passed via secure, HttpOnly, SameSite cookies to protect against XSS and CSRF.',
  },
  {
    title: 'Input Validation & Schema Sanitization',
    category: 'API Security',
    status: 'IMPLEMENTED',
    details:
      'Every incoming API payload is strictly validated using Zod runtime schemas before executing controllers or database queries.',
  },
  {
    title: 'API Rate Limiting & Abuse Prevention',
    category: 'API Security',
    status: 'IMPLEMENTED',
    details:
      'Strict rate-limiting middleware guards auth and public endpoints against brute-force attacks and automated denial-of-service attempts.',
  },
  {
    title: 'Multi-Tenant Database Row Isolation',
    category: 'Database Security',
    status: 'IMPLEMENTED',
    details:
      'Every query executed by the database layer strictly enforces `workspaceId` relational scoping to guarantee absolute tenant isolation.',
  },
  {
    title: 'Secure Environment Secret Storage',
    category: 'Infrastructure',
    status: 'IMPLEMENTED',
    details:
      'Database credentials, JWT secret keys, and third-party API tokens are loaded exclusively from encrypted runtime environment variables.',
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    category: 'Authorization',
    status: 'IMPLEMENTED',
    details:
      'Fine-grained permissions verify whether a user holds Owner, Admin, Member, or Guest status before granting mutation rights.',
  },
  {
    title: 'Field-Level AES-256 Secret Encryption',
    category: 'Data Protection',
    status: 'PLANNED',
    details:
      'Scheduled enhancement to encrypt sensitive API key fields at the application layer before writing to persistent storage disk.',
  },
  {
    title: 'Automated Audit Log Streaming',
    category: 'Monitoring',
    status: 'PLANNED',
    details:
      'Planned security feature to stream security audit events to enterprise SIEM platforms (e.g. Datadog, Splunk).',
  },
  {
    title: 'Least-Privilege Database User Rights',
    category: 'Database Security',
    status: 'BEST PRACTICE',
    details:
      'Production database instances operate under restricted database users limited strictly to required tables and schemas.',
  },
  {
    title: 'Continuous Vulnerability Scanning',
    category: 'Infrastructure',
    status: 'BEST PRACTICE',
    details:
      'Automated CI/CD dependency vulnerability scans verify npm packages against known CVE vulnerability databases.',
  },
];

export const SecurityPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              System Defense
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Security Architecture &{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Data Integrity.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              A transparent, honest breakdown of AETHER’s technical safeguards, authentication
              controls, and database boundary isolation.
            </p>
          </div>

          {/* Honest Compliance Note Alert */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 font-bold text-indigo-400">
                ℹ
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Transparent Compliance Disclosure
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  We prioritize accurate technical definitions over marketing hype: AETHER does not
                  assert third-party validation certifications such as SOC 2 Type II, ISO/IEC 27001,
                  or formal HIPAA compliance at this development stage. System security is
                  engineered directly into our open architecture through strict field isolation,
                  parameterized database routines, and minimal external dependencies.
                </p>
              </div>
            </div>
          </div>

          {/* Security Features Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                        item.status === 'IMPLEMENTED'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : item.status === 'PLANNED'
                            ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                            : 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400">{item.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl border border-white/10 bg-black/40 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Have security questions or vulnerability reports?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Our engineering team responds promptly to technical security inquiries and
              vulnerability disclosures.
            </p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Contact Security Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default SecurityPage;
