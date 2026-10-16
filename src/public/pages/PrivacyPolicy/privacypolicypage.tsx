import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'October 15, 2026';
  const entityPlaceholder = '[AETHER Platform / Operating Legal Entity Name]';
  const addressPlaceholder = '[Registered Business Address / Place of Operation]';
  const jurisdictionPlaceholder = '[Applicable Jurisdiction / Country]';
  const verifiedContactEmail = 'vkgroups127@gmail.com';

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Shield className="h-3.5 w-3.5" />
              Transparent Data Governance
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 font-mono text-xs text-zinc-400">
              Effective Date: {lastUpdated} | Operating Entity:{' '}
              <span className="font-semibold text-zinc-300">{entityPlaceholder}</span>
            </p>
          </header>

          {/* Legal Notice Disclaimer Banner */}
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-zinc-300 sm:text-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold text-white">Notice Concerning Legal Review: </span>
                This document describes the actual data processing, storage, and security mechanisms
                implemented within the AETHER software repository. Prior to formal commercial deployment,
                deploying organizations must configure placeholder legal parameters and have this policy
                reviewed by qualified legal counsel in their governing jurisdiction.
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-300">
            {/* 1. Introduction & Scope */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Scope and Purpose</h2>
              <p>
                This Privacy Policy explains how {entityPlaceholder} (&quot;AETHER,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) collects, uses, stores, and protects personal information
                when you access the AETHER web application, authenticated workspace, APIs, and associated
                services (collectively, the &quot;Services&quot;).
              </p>
              <p>
                We believe in complete transparency: we collect only data necessary to provide and secure
                workspace features, we enforce strict tenant isolation, and we do not monetize user data
                or sell information to third-party data brokers.
              </p>
            </section>

            {/* 2. Information We Actually Collect */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Categories of Information Collected</h2>
              <p>
                Based on the actual software architecture of the AETHER platform, data collection is limited
                to the following verified categories:
              </p>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div>
                  <h3 className="font-semibold text-white">A. Account & Authentication Data</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-400">
                    <li>
                      <strong className="text-zinc-200">Registration Details:</strong> Full name, email address,
                      and cryptographically salted password hashes (processed via Bcrypt/Argon2id; plain-text
                      passwords are never saved).
                    </li>
                    <li>
                      <strong className="text-zinc-200">OAuth Identity:</strong> If you sign in via Google OAuth,
                      we receive your verified Google account email, name, and OAuth profile identifier.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Session Identifiers:</strong> Signed JSON Web Tokens (JWT)
                      issued to maintain authenticated sessions, managed through secure headers or HttpOnly cookies.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">B. User-Generated Workspace Content</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-400">
                    <li>
                      <strong className="text-zinc-200">Projects & Tasks:</strong> Task titles, descriptions,
                      deadlines, milestones, and priority statuses created in your workspace.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Planning & Focus Records:</strong> Calendar entries,
                      daily schedule blocks, weekly planner agendas, and Pomodoro focus timer logs.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Knowledge Documents & Files:</strong> Uploaded Markdown,
                      PDF, text, CSV, and source code files, stored locally in backend file storage with metadata
                      in PostgreSQL.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Cognitive Hub Practice Data:</strong> Scores, completion
                      timestamps, and progress statistics from cognitive problem-solving exercises.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">C. AI Prompts & Interaction Data</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-400">
                    <li>
                      <strong className="text-zinc-200">Conversations:</strong> Questions, instructions, and
                      prompt histories exchanged with the AI assistant, stored per user/workspace conversation.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Vector Embeddings:</strong> High-density mathematical
                      vector representations generated from your notes and uploaded documents using PostgreSQL
                      pgvector to enable semantic search.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">D. Technical Telemetry & Operational Logs</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-zinc-400">
                    <li>
                      <strong className="text-zinc-200">Access Logs:</strong> IP address, browser type, operating
                      system, request URL, HTTP status codes, and latency timestamps for diagnostic error tracking
                      and DDoS prevention.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">E. Payment Information</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    AETHER is currently offered as a free Public Beta / self-hosted open workspace. We do not
                    collect, process, or store credit card numbers, bank account numbers, or billing payment
                    credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Why Information Is Used */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. How Your Information Is Used</h2>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>To authenticate your identity and safeguard your account access.</li>
                <li>To render your personal schedule, tasks, cognitive practice items, and project dashboards.</li>
                <li>To index and search documents within your isolated workspace.</li>
                <li>To construct contextual prompts for AI assistant responses based on your active files.</li>
                <li>To detect, prevent, and mitigate security threats, brute-force attacks, and API abuse.</li>
                <li>To investigate reported bugs, misleading claims, and formal user complaints.</li>
              </ul>
            </section>

            {/* 4. Third-Party Services & AI Providers */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Third-Party Services & AI Sub-Processors</h2>
              <p>
                When cloud AI assistance is enabled, prompt text and relevant context excerpts are transmitted
                to third-party model providers to generate completions:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Google Gemini API (@google/genai):</strong> Used for
                  natural language understanding, synthesis, and conversational completions. Requests are
                  governed by Google Cloud API terms, which specify that customer data processed via API is not
                  used to train Google foundation models.
                </li>
                <li>
                  <strong className="text-zinc-200">Local Model Server (AETHER_MODEL):</strong> When configured,
                  inference runs on self-hosted infrastructure where no data leaves the operator’s host environment.
                </li>
                <li>
                  <strong className="text-zinc-200">Email Notification Service (Resend / SMTP):</strong> If
                  configured, used solely to send account confirmation emails and complaint receipts.
                </li>
              </ul>
              <p className="text-xs text-zinc-400">
                We do not sell user data to advertising networks or third-party data aggregators under any
                circumstances.
              </p>
            </section>

            {/* 5. Data Storage, Isolation & Security */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Security Measures & Storage Architecture</h2>
              <p>
                We implement honest, verified technical safeguards directly within the codebase:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">In-Transit Encryption:</strong> Enforces TLS 1.3 encryption
                  across all HTTP and WebSocket connections.
                </li>
                <li>
                  <strong className="text-zinc-200">Password Hashing:</strong> Passwords are cryptographically
                  salted and hashed using modern key derivation functions.
                </li>
                <li>
                  <strong className="text-zinc-200">Tenant Scoping:</strong> Every relational query strictly scopes
                  data access by authenticated user and workspace ID to prevent cross-tenant leakage.
                </li>
                <li>
                  <strong className="text-zinc-200">Abuse Protection:</strong> Automated rate-limiting middleware
                  protects login, signup, and contact endpoints against brute-force attacks.
                </li>
              </ul>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-zinc-400">
                <strong className="text-zinc-300">Certification Notice: </strong>
                We do not claim formal third-party compliance certifications (such as SOC 2 Type II, ISO/IEC 27001,
                or HIPAA compliance) at this beta stage. Security is provided through robust open architecture,
                not fabricated marketing badges.
              </div>
            </section>

            {/* 6. Data Retention & Erasure */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Data Retention and Account Deletion</h2>
              <p>
                We retain your workspace records as long as your account remains active. Users may request
                account deletion at any time. Upon verified deletion:
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                <li>Relational database rows (tasks, projects, calendar entries, notes) are deleted.</li>
                <li>Uploaded document files and associated vector embeddings are purged from active storage.</li>
                <li>Diagnostic web server logs are automatically rotated and expunged on standard retention cycles.</li>
              </ul>
            </section>

            {/* 7. User Rights */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">7. Your Privacy Rights</h2>
              <p>
                Depending on your location and applicable data protection legislation (such as GDPR, CCPA/CPRA, or
                equivalent consumer protection laws), you may have the right to:
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                <li>Access and obtain a copy of the personal information we hold about you.</li>
                <li>Request rectification of inaccurate account details.</li>
                <li>Request complete erasure of your personal data.</li>
                <li>Object to or restrict specific processing operations.</li>
                <li>Lodge a complaint regarding data handling or privacy representations.</li>
              </ul>
            </section>

            {/* 8. Complaint Procedures & Contact */}
            <section className="space-y-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <h2 className="text-lg font-bold text-white">8. Privacy Inquiries & Formal Complaints</h2>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                If you believe your personal information has been mishandled, or if an actual service behavior
                does not match this Privacy Policy, you have direct access to our resolution mechanisms:
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/complaint"
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 sm:text-sm"
                >
                  Submit a Privacy Complaint
                </Link>
                <a
                  href={`mailto:${verifiedContactEmail}`}
                  className="text-xs font-semibold text-indigo-400 underline hover:text-indigo-300 sm:text-sm"
                >
                  Email Privacy Desk: {verifiedContactEmail}
                </a>
              </div>
              <p className="text-xs text-zinc-400">
                Operating Address: {addressPlaceholder} | Governing Law: {jurisdictionPlaceholder}
              </p>
            </section>

            {/* 9. Policy Updates */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">9. Changes to This Policy</h2>
              <p>
                We may revise this Privacy Policy to reflect codebase updates, regulatory requirements, or feature
                modifications. Material changes will be posted directly to this URL with a revised effective date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default PrivacyPolicyPage;
