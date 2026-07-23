# AETHER Navigation Icon System

A production-grade, enterprise icon library designed specifically for the **AETHER Platform**.

## Brand Palette Reference
- **Primary Blue**: `#2563EB`
- **Sky Blue**: `#3B82F6`
- **Cyan**: `#22D3EE`
- **Light Blue**: `#38BDF8`

## Usage with React & Tailwind CSS

```tsx
import { DashboardIcon, AiIcon, SettingsIcon } from '@/public/icons/navigation';

export const Sidebar = ({ activeTab }: { activeTab: string }) => {
  return (
    <nav className="flex flex-col space-y-2 bg-slate-900 p-4">
      <!-- Standard Icon -->
      <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors">
        <DashboardIcon size="{20}"/>
        <span>Dashboard</span>
      </button>

      <!-- Active Navigation with Brand Gradient -->
      <button className="flex items-center space-x-3 text-white font-medium bg-blue-600/10 p-2 rounded-lg border border-blue-500/20">
        <AiIcon size="{20}" useGradient="{true}"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          AETHER AI
        </span>
      </button>
    </nav>
  );
};