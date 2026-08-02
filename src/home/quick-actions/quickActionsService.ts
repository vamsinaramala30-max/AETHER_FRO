export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: 'plus' | 'code' | 'document' | 'deploy' | 'settings';
  shortcutKey?: string;
  actionType: 'navigate' | 'modal' | 'external';
  targetUrl?: string;
}

export async function fetchQuickActions(): Promise<QuickActionItem[]> {
  return [
    {
      id: 'action-1',
      label: 'New Repository',
      description: 'Initialize a new feature branch or service repo',
      icon: 'plus',
      shortcutKey: '⌘+N',
      actionType: 'navigate',
      targetUrl: '/projects/new',
    },
    {
      id: 'action-2',
      label: 'Trigger CI Pipeline',
      description: 'Run automated build and integration testing suite',
      icon: 'deploy',
      shortcutKey: '⌘+Shift+D',
      actionType: 'modal',
    },
    {
      id: 'action-3',
      label: 'Generate API Docs',
      description: 'Export OpenAPI v3 schemas and Type definitions',
      icon: 'document',
      actionType: 'navigate',
      targetUrl: '/docs/export',
    },
    {
      id: 'action-4',
      label: 'System Diagnostics',
      description: 'Inspect latency, memory usage, and backend health',
      icon: 'settings',
      shortcutKey: '⌘+K',
      actionType: 'navigate',
      targetUrl: '/settings/system',
    },
  ];
}
