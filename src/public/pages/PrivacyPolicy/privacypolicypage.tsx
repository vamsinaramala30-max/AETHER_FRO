import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'August 10, 2026';
  const companyName = 'Aether Systems';
  const contactEmail = 'privacy@aether.local';

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="border-b border-white/10 pb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
              Legal Compliance
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 font-mono text-xs text-zinc-400">
              Last Updated: {lastUpdated} | Issuer: {companyName}
            </p>
          </header>

          {/* Structured Document Body */}
          <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-300">
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Introduction</h2>
              <p>
                This Privacy Policy explains how {companyName} (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) collects, uses, discloses, and protects your information when you
                access or use the AETHER website, workspace application, developer APIs, and related
                services (collectively, the &quot;Services&quot;).
              </p>
              <p>
                By registering for an account or utilizing our Services, you acknowledge that you
                have read and understood the data practices described in this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
              <p>We collect information through two primary mechanisms:</p>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div>
                  <h3 className="font-semibold text-white">
                    A. Information Users Provide Directly
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
                    <li>
                      Account Registration Data: Name, email address, password hashes, and company
                      affiliation.
                    </li>
                    <li>
                      Workspace Content: Documents, project task goals, code files, and custom
                      prompt inputs uploaded to your workspace.
                    </li>
                    <li>
                      Support Inquiries: Messages sent through our contact and support feedback
                      forms.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    B. Automatically Collected Information
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
                    <li>
                      Log & Usage Telemetry: IP addresses, browser types, operating system specs,
                      timestamps, and page request routes.
                    </li>
                    <li>
                      Session Identifiers: Cryptographic JWT tokens and local storage preferences.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. How Information Is Used */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. How Information Is Used</h2>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>
                  To provision, maintain, and optimize workspace performance and authentication
                  states.
                </li>
                <li>
                  To execute vector search indexer routines and AI assistant prompt context
                  assembly.
                </li>
                <li>
                  To prevent security threats, unauthorized access, rate-limit violations, and
                  abuse.
                </li>
                <li>
                  To communicate critical system updates, password reset requests, and security
                  notifications.
                </li>
              </ul>
            </section>

            {/* 4. AI-Related Data Processing */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. AI-Related Data Processing</h2>
              <p>
                When you submit queries to the AI Assistant or upload documents for knowledge
                indexing:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>
                  Your inputs are processed solely to generate real-time completions for your active
                  session.
                </li>
                <li>
                  Private tenant data is never sold, shared, or used to train public foundation LLM
                  models.
                </li>
                <li>
                  Vector embeddings generated from your documents are stored in dedicated PostgreSQL
                  schemas isolated by workspace tenant ID.
                </li>
              </ul>
            </section>

            {/* 5. Cookies & Local Storage */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Cookies & Storage Controls</h2>
              <p>
                AETHER uses essential HttpOnly cookies and local browser storage to manage
                authentication state, active workspace selection, and theme preferences. We do not
                utilize third-party tracking cookies or cross-site advertising scripts.
              </p>
            </section>

            {/* 6. Data Security & Retention */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Data Security & Retention</h2>
              <p>
                We implement industry-standard administrative, physical, and technical safeguards
                including TLS in-transit encryption and salted password hashing.
              </p>
              <p>
                We retain your workspace data as long as your account remains active. Upon
                initiating account deletion, all relational rows, uploaded files, and vector index
                fragments are permanently deleted within 72 hours.
              </p>
            </section>

            {/* 7. User Rights & Data Deletion */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">7. User Rights & Account Deletion</h2>
              <p>Depending on your jurisdiction, you have the following rights:</p>
              <ul className="list-disc space-y-1 pl-5 text-zinc-400">
                <li>The right to inspect and request a export copy of your workspace data.</li>
                <li>The right to correct inaccurate account credentials.</li>
                <li>The right to request complete erasure of your account and personal data.</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, submit a request via our{' '}
                <Link to="/contact" className="text-indigo-400 underline hover:text-indigo-300">
                  Contact Page
                </Link>{' '}
                or email {contactEmail}.
              </p>
            </section>

            {/* 8. Children's Privacy & Updates */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">8. Children&apos;s Privacy & Updates</h2>
              <p>
                Our Services are intended strictly for enterprise and developer use. We do not
                knowingly collect personal information from children under 16 years of age.
              </p>
              <p>
                We may update this Privacy Policy periodically. Notice of material updates will be
                posted directly on this page with an updated timestamp.
              </p>
            </section>

            {/* 9. Contact */}
            <section className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-6">
              <h2 className="text-lg font-bold text-white">9. Contact Information</h2>
              <p className="text-xs text-zinc-400">
                For questions or privacy concerns regarding this policy, contact our Data Protection
                Officer:
              </p>
              <p className="font-mono text-xs text-indigo-400">{contactEmail}</p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default PrivacyPolicyPage;
