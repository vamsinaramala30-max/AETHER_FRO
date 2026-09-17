import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

interface QuickToolCardProps {
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
}

const QuickToolCard: React.FC<QuickToolCardProps> = ({
  title,
  description,
  badge,
  icon,
  iconBg,
  href,
}) => (
  <Link
    to={href}
    className="group flex flex-col justify-between rounded-2xl border border-aether-border bg-aether-surface p-6 shadow-sm transition-all duration-200 hover:border-indigo-400/50 hover:shadow-md"
  >
    <div>
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
          {icon}
        </div>
        <span className="rounded-full border border-aether-border bg-aether-subtle px-2.5 py-0.5 text-[11px] font-semibold text-aether-muted">
          {badge}
        </span>
      </div>
      <h3 className="mt-4 text-base font-bold text-aether-main transition-colors group-hover:text-indigo-500">
        {title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-aether-muted">
        {description}
      </p>
    </div>

    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-500 transition-transform group-hover:translate-x-1">
      <span>Open Tool</span>
      <ArrowRight className="h-3.5 w-3.5" />
    </div>
  </Link>
);

export const QuickToolsPage: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <div className="space-y-1 border-b border-aether-border pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-aether-main sm:text-3xl">
              Quick Tools
            </h1>
            <p className="text-xs text-aether-muted sm:text-sm">
              Focused productivity utilities and verified external information directory.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <QuickToolCard
          title="Focus Timer"
          description="Configurable focus sessions with audio feedback, interval cycles, and persistent telemetry tracking."
          badge="Productivity"
          icon={<Clock className="h-6 w-6 text-emerald-500" />}
          iconBg="bg-emerald-500/10"
          href="/app/workspace/focustimer"
        />
        <QuickToolCard
          title="Web Directory"
          description="Curated archive of verified government, academic, and technical portals with categorized search and bookmarking."
          badge="Verified Archive"
          icon={<Globe className="h-6 w-6 text-cyan-500" />}
          iconBg="bg-cyan-500/10"
          href="/app/workspace/webdirectory"
        />
      </div>

      {/* Note */}
      <div className="flex items-center gap-3 rounded-2xl border border-aether-border bg-aether-subtle/50 p-4 text-xs text-aether-muted">
        <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
        <span>
          Tools run locally in your active workspace and synchronize session telemetry automatically.
        </span>
      </div>
    </PageWrapper>
  );
};

export default QuickToolsPage;
