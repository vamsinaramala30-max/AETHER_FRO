import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

interface DocSection {
  id: string;
  category: string;
  title: string;
  badge?: 'Production' | 'Preview' | 'Coming soon';
  description: string;
  content: string[];
  codeSnippet?: string;
}

const DOCS_DATA: DocSection[] = [
  {
    id: 'getting-started',
    category: 'Core Concepts',
    title: 'Getting Started with AETHER',
    badge: 'Production',
    description: 'Learn how to set up your workspace, configure AI agents, and connect data streams.',
    content: [
      'AETHER is designed around unified cognitive spaces called Workspaces.',
      'To begin, create an organization workspace or join an invitation link from your admin.',
      'Configure environment secrets securely in Workspace Settings under API Credentials.',
      'Install optional IDE extensions and CLI tools to sync context automatically.',
    ],
    codeSnippet: `$ npm install -g @aether/cli
$ aether auth login --token your_jwt_token
$ aether workspace init`,
  },
  {
    id: 'aether-overview',
    category: 'Core Concepts',
    title: 'AETHER Platform Overview',
    badge: 'Production',
    description: 'Architecture breakdown of AETHER cognitive kernel, database schema, and vector retrieval.',
    content: [
      'The platform consists of three core components: AI Kernel, Knowledge Graph, and Execution Engines.',
      'The AI Kernel routes prompt requests using smart model selection based on latency and task type.',
      'Knowledge Graph indexer extracts entity dependencies in realtime from uploaded documents.',
    ],
  },
  {
    id: 'ai-platform',
    category: 'AI Capabilities',
    title: 'AI Platform & LLM Orchestration',
    badge: 'Production',
    description: 'How AETHER manages conversational state, prompt pipelines, and multi-model fallbacks.',
    content: [
      'Conversations preserve message trajectory and state using PostgreSQL vector embeddings.',
      'Context windows automatically condense past turns when token thresholds are exceeded.',
      'Enterprise models include strict boundaries to prevent private workspace data leakage.',
    ],
  },
  {
    id: 'projects',
    category: 'Workspace Tools',
    title: 'Projects & Milestones',
    badge: 'Production',
    description: 'Managing task goals, project context, and automated sprint velocity tracking.',
    content: [
      'Every project maintains a dedicated context memory graph.',
      'Task items link directly to commits, PRs, and AI assistant prompt threads.',
    ],
  },
  {
    id: 'knowledge',
    category: 'Workspace Tools',
    title: 'Knowledge Base & Vector Search',
    badge: 'Production',
    description: 'Uploading documents, automatic semantic indexing, and hybrid vector/keyword search.',
    content: [
      'Supports PDF, Markdown, JSON, CSV, and code repositories.',
      'Files are chunked into semantic units and embedded using high-density vector representations.',
    ],
    codeSnippet: `// Example Vector Search Query
const results = await aether.knowledge.search({
  query: "Authentication flow for OAuth2",
  topK: 5,
  minScore: 0.82
});`,
  },
  {
    id: 'automation',
    category: 'Automation',
    title: 'Workflows & Scheduled Automation',
    badge: 'Production',
    description: 'Creating event-driven triggers, background cron executions, and tool actions.',
    content: [
      'Construct automated pipelines visually or using TypeScript definition files.',
      'Triggers include webhook events, database mutations, calendar events, and recurring cron expressions.',
    ],
  },
  {
    id: 'workspace',
    category: 'Workspace Tools',
    title: 'Workspace & Team Collaboration',
    badge: 'Production',
    description: 'Role-based access control (RBAC), multi-tenant isolation, and member management.',
    content: [
      'Roles: Owner, Admin, Member, and Viewer with granular permission overrides.',
      'Audit logs record every administrative action and security credential update.',
    ],
  },
  {
    id: 'security-docs',
    category: 'Security & Privacy',
    title: 'Security Architecture & Best Practices',
    badge: 'Production',
    description: 'Details on TLS 1.3 in-transit encryption, AES-256 field encryption, and secret storage.',
    content: [
      'All passwords are salted and hashed using Argon2id.',
      'JWT tokens are cryptographically signed using asymmetric keys and refreshed via HttpOnly cookies.',
    ],
  },
  {
    id: 'privacy-docs',
    category: 'Security & Privacy',
    title: 'Data Privacy Controls & Deletion',
    badge: 'Production',
    description: 'Understanding zero-retention policies, data export routines, and user privacy rights.',
    content: [
      'Users can request a complete ZIP export of their personal workspace history.',
      'Permanent deletion removes all relational rows and vector embeddings within 72 hours.',
    ],
  },
  {
    id: 'api-reference',
    category: 'Developer Tools',
    title: 'REST API & Webhook Reference',
    badge: 'Coming soon',
    description: 'Full OpenAPI / Swagger specification for programmatically controlling AETHER resources.',
    content: [
      'The REST API specification is currently undergoing external security audit.',
      'Developers will be able to spawn agents, execute workflows, and query knowledge bases programmatically.',
    ],
  },
];

export const DocsPage: React.FC = () => {
  const [activeId, setActiveId] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = DOCS_DATA.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = DOCS_DATA.find((d) => d.id === activeId) || DOCS_DATA[0];

  return (
    <PublicPageLayout>
      <div className="relative py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header & Search */}
          <div className="border-b border-white/10 pb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Developer & Knowledge Specs
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              AETHER Documentation
            </h1>
            <p className="mt-3 text-base text-zinc-400 max-w-3xl">
              Technical guides, architectural blueprints, integration details, and system references.
            </p>

            {/* Search Input */}
            <div className="mt-6 max-w-xl relative">
              <input
                type="text"
                placeholder="Search documentation (e.g. vector search, security, cron)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg
                className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-3">
                  Articles ({filteredDocs.length})
                </h3>
                <nav className="space-y-1" aria-label="Documentation section navigation">
                  {filteredDocs.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActiveId(doc.id)}
                      className={`w-full text-left rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                        activeId === doc.id
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{doc.title}</span>
                        {doc.badge === 'Coming soon' && (
                          <span className="ml-1 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                            Soon
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Document Content View */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10 shadow-xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                      {activeDoc.category}
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                      {activeDoc.title}
                    </h2>
                  </div>
                  {activeDoc.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        activeDoc.badge === 'Production'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : activeDoc.badge === 'Preview'
                          ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {activeDoc.badge}
                    </span>
                  )}
                </div>

                <p className="mt-6 text-base leading-relaxed text-zinc-300">
                  {activeDoc.description}
                </p>

                <div className="mt-8 space-y-4">
                  {activeDoc.content.map((paragraph, idx) => (
                    <div key={idx} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{paragraph}</span>
                    </div>
                  ))}
                </div>

                {activeDoc.codeSnippet && (
                  <div className="mt-8">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Code Example / Execution
                    </h4>
                    <pre className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
                      <code>{activeDoc.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                  <p className="text-xs text-zinc-500">
                    Need further technical assistance?
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Contact Developer Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default DocsPage;
