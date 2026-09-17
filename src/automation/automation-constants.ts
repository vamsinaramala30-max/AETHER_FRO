import {
  TriggerType,
  ConditionOperator,
  AIActionType,
  SystemActionType,
  AutomationTemplate,
} from './automation-types';

export const TRIGGER_OPTIONS: Array<{
  value: TriggerType;
  label: string;
  description: string;
  category: string;
}> = [
  {
    value: 'SCHEDULE',
    label: 'Schedule / Cron',
    description: 'Triggers on periodic intervals or daily/weekly schedules',
    category: 'Time',
  },
  {
    value: 'CALENDAR_EVENT',
    label: 'Calendar Event',
    description: 'Triggers before or after a calendar meeting or event',
    category: 'Events',
  },
  {
    value: 'TASK_CREATED',
    label: 'Task Created',
    description: 'Triggers when a new task is added to workspace',
    category: 'Tasks',
  },
  {
    value: 'TASK_COMPLETED',
    label: 'Task Completed',
    description: 'Triggers when any task is marked done',
    category: 'Tasks',
  },
  {
    value: 'TASK_OVERDUE',
    label: 'Task Overdue',
    description: 'Triggers when a task deadline passes',
    category: 'Tasks',
  },
  {
    value: 'PROJECT_CREATED',
    label: 'Project Created',
    description: 'Triggers when a project is initialized',
    category: 'Projects',
  },
  {
    value: 'PROJECT_UPDATED',
    label: 'Project Updated',
    description: 'Triggers when project status or milestones change',
    category: 'Projects',
  },
  {
    value: 'GOAL_UPDATED',
    label: 'Goal Progress Updated',
    description: 'Triggers when key results or goal metrics update',
    category: 'Goals',
  },
  {
    value: 'DOCUMENT_CREATED',
    label: 'Document Created',
    description: 'Triggers when a document or note is created in Knowledge',
    category: 'Knowledge',
  },
  {
    value: 'DOCUMENT_UPDATED',
    label: 'Document Updated',
    description: 'Triggers when a document is updated',
    category: 'Knowledge',
  },
  {
    value: 'FILE_UPLOADED',
    label: 'File Uploaded',
    description: 'Triggers when a file is uploaded to workspace',
    category: 'Files',
  },
  {
    value: 'AI_EVENT',
    label: 'AI Event / Signal',
    description: 'Triggers when Aether AI detects high priority context',
    category: 'AI',
  },
  {
    value: 'AGENT_EVENT',
    label: 'Agent Signal',
    description: 'Triggers when a background agent finishes execution',
    category: 'AI',
  },
  {
    value: 'MANUAL',
    label: 'Manual Trigger',
    description: 'Triggers on user click or quick shortcut',
    category: 'General',
  },
];

export const CONDITION_OPERATORS: Array<{ value: ConditionOperator; label: string }> = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does Not Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'exists', label: 'Exists / Not Null' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
  { value: 'NOT', label: 'NOT' },
];

export const AI_ACTION_OPTIONS: Array<{ value: AIActionType; label: string; description: string }> =
  [
    {
      value: 'ASK_AETHER',
      label: 'Ask Aether AI',
      description: 'Query Aether with custom system instructions',
    },
    {
      value: 'SUMMARIZE',
      label: 'Summarize Content',
      description: 'Generate concise executive summary of input',
    },
    {
      value: 'ANALYZE',
      label: 'Analyze Priorities',
      description: 'Evaluate urgency, task load, and dependencies',
    },
    {
      value: 'CLASSIFY',
      label: 'Classify & Tag',
      description: 'Categorize document, task, or message into tags',
    },
    {
      value: 'GENERATE',
      label: 'Generate Action Plan',
      description: 'Draft step-by-step resolution plan',
    },
    {
      value: 'EXTRACT',
      label: 'Extract Entities',
      description: 'Pull key dates, contacts, and action items',
    },
    {
      value: 'TRANSFORM',
      label: 'Transform Format',
      description: 'Convert text to markdown, JSON, or task structure',
    },
  ];

export const SYSTEM_ACTION_OPTIONS: Array<{
  value: SystemActionType;
  label: string;
  description: string;
}> = [
  {
    value: 'CREATE_TASK',
    label: 'Create Task',
    description: 'Add a new task to workspace with assignee & due date',
  },
  {
    value: 'UPDATE_TASK',
    label: 'Update Task',
    description: 'Change status, priority, or tags of a task',
  },
  {
    value: 'COMPLETE_TASK',
    label: 'Complete Task',
    description: 'Mark matching tasks as completed',
  },
  {
    value: 'CREATE_PROJECT',
    label: 'Create Project',
    description: 'Initialize a new project board',
  },
  {
    value: 'UPDATE_PROJECT',
    label: 'Update Project',
    description: 'Modify project progress or status',
  },
  {
    value: 'UPDATE_GOAL',
    label: 'Update Goal Progress',
    description: 'Record progress on active goal',
  },
  {
    value: 'CREATE_CALENDAR_EVENT',
    label: 'Create Calendar Event',
    description: 'Schedule event or block focus time in Calendar',
  },
  {
    value: 'CREATE_REMINDER',
    label: 'Create Reminder',
    description: 'Set timed notification reminder',
  },
  {
    value: 'CREATE_KNOWLEDGE_ITEM',
    label: 'Create Knowledge Note',
    description: 'Save AI response or digest to Knowledge base',
  },
  {
    value: 'SAVE_AI_RESPONSE',
    label: 'Save AI Response',
    description: 'Log AI output into project notes',
  },
  {
    value: 'ORGANIZE_DOCUMENT',
    label: 'Organize Document',
    description: 'Tag and move document to knowledge category',
  },
  {
    value: 'ORGANIZE_FILE',
    label: 'Organize File',
    description: 'Categorize uploaded file into project directory',
  },
  {
    value: 'RUN_SUPPORTED_AGENT',
    label: 'Run Autonomous Agent',
    description: 'Invoke specialized background AI agent',
  },
  {
    value: 'CREATE_NOTIFICATION',
    label: 'Send Notification',
    description: 'Alert user via in-app notifications',
  },
];

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'tmpl-daily-planning',
    title: 'Daily Planning Brief',
    description:
      'Every weekday morning, Aether reviews your calendar & tasks, synthesizes priorities, and prepares your daily action plan.',
    category: 'Productivity',
    badge: 'Popular',
    iconName: 'Calendar',
    popularity: 98,
    estimatedTimeSaved: '2.5 hrs / week',
    preset: {
      name: 'Daily Planning Brief',
      description: 'Reviews calendar & open tasks every morning at 8:00 AM',
      trigger: 'SCHEDULE',
      schedule: '0 8 * * 1-5',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Schedule: Weekdays at 8:00 AM',
          triggerType: 'SCHEDULE',
          config: { cron: '0 8 * * 1-5' },
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Analyze Calendar & Task Priorities',
          aiActionType: 'ANALYZE',
          config: { scope: ['calendar', 'tasks'], goal: 'Identify top 3 focus priorities' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Generate Notification Briefing',
          actionType: 'CREATE_NOTIFICATION',
          config: {
            title: 'Your Aether Daily Plan is Ready',
            message: 'Review today top priorities and schedule.',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-task-follow-up',
    title: 'Task Follow-up',
    description:
      'When a key milestone task is completed, automatically generates a follow-up review task.',
    category: 'Tasks',
    badge: 'Essential',
    iconName: 'Sparkles',
    popularity: 94,
    estimatedTimeSaved: '1.8 hrs / week',
    preset: {
      name: 'Task Follow-up',
      description: 'Creates follow-up action items when high-level tasks finish',
      trigger: 'TASK_COMPLETED',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: Task Completed',
          triggerType: 'TASK_COMPLETED',
          config: {},
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Analyze Completed Task Context',
          aiActionType: 'ANALYZE',
          config: { focusArea: 'next steps' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Create Follow-up Task',
          actionType: 'CREATE_TASK',
          config: { title: 'Review completed deliverable & gather feedback', priority: 'MEDIUM' },
        },
      ],
    },
  },
  {
    id: 'tmpl-overdue-task-reminder',
    title: 'Overdue Task Reminder',
    description:
      'Monitors overdue tasks, sending immediate notifications to elevate priority and avoid missed deadlines.',
    category: 'Tasks',
    badge: 'Automation',
    iconName: 'Clock',
    popularity: 91,
    estimatedTimeSaved: '2.0 hrs / week',
    preset: {
      name: 'Overdue Task Reminder',
      description: 'Triggers when a task deadline passes without completion',
      trigger: 'TASK_OVERDUE',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: Task Overdue',
          triggerType: 'TASK_OVERDUE',
          config: {},
        },
        {
          id: 'step-2',
          type: 'condition',
          title: 'Check Priority',
          config: { operator: 'equals', field: 'priority', value: 'HIGH' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Send Overdue Reminder Notification',
          actionType: 'CREATE_NOTIFICATION',
          config: {
            title: 'Overdue High-Priority Task Alert',
            message: 'Action required on overdue task.',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-project-progress-summary',
    title: 'Project Progress Summary',
    description:
      'Calculates milestone completion across active projects every Friday afternoon and outputs a status report.',
    category: 'Projects',
    badge: 'Reports',
    iconName: 'Folder',
    popularity: 89,
    estimatedTimeSaved: '3.0 hrs / week',
    preset: {
      name: 'Project Progress Summary',
      description: 'Audits active project progress every Friday at 4:00 PM',
      trigger: 'SCHEDULE',
      schedule: '0 16 * * 5',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Schedule: Fridays at 4:00 PM',
          triggerType: 'SCHEDULE',
          config: { cron: '0 16 * * 5' },
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Evaluate Milestones & Progress',
          aiActionType: 'ANALYZE',
          config: { target: 'active_projects' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Update Goal Progress',
          actionType: 'UPDATE_GOAL',
          config: { autoSync: true },
        },
      ],
    },
  },
  {
    id: 'tmpl-knowledge-digest',
    title: 'Knowledge Digest',
    description:
      'Compiles recently created notes and documents into a organized weekly Knowledge Base digest.',
    category: 'Knowledge',
    badge: 'AI Powered',
    iconName: 'BookOpen',
    popularity: 88,
    estimatedTimeSaved: '2.2 hrs / week',
    preset: {
      name: 'Knowledge Digest',
      description: 'Generates digest note from newly added workspace documents',
      trigger: 'DOCUMENT_CREATED',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: Document Created',
          triggerType: 'DOCUMENT_CREATED',
          config: {},
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Summarize Knowledge Document',
          aiActionType: 'SUMMARIZE',
          config: { maxLength: 400 },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Save Digest to Knowledge Base',
          actionType: 'CREATE_KNOWLEDGE_ITEM',
          config: { title: 'Knowledge Base Executive Digest' },
        },
      ],
    },
  },
  {
    id: 'tmpl-daily-productivity-summary',
    title: 'Daily Productivity Summary',
    description:
      'Analyzes completed tasks and workspace activity at the end of each workday and logs a daily productivity summary.',
    category: 'Productivity',
    badge: 'Insights',
    iconName: 'Sparkles',
    popularity: 93,
    estimatedTimeSaved: '1.5 hrs / week',
    preset: {
      name: 'Daily Productivity Summary',
      description: 'Generates workday summary at 6:00 PM daily',
      trigger: 'SCHEDULE',
      schedule: '0 18 * * 1-5',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Schedule: Weekdays at 6:00 PM',
          triggerType: 'SCHEDULE',
          config: { cron: '0 18 * * 1-5' },
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Analyze Completed Work & Output',
          aiActionType: 'ANALYZE',
          config: { scope: 'daily_output' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Send Daily Productivity Notification',
          actionType: 'CREATE_NOTIFICATION',
          config: {
            title: 'Daily Productivity Summary Ready',
            message: 'Review your completed tasks and highlights for today.',
          },
        },
      ],
    },
  },
  {
    id: 'tmpl-weekly-workspace-summary',
    title: 'Weekly Workspace Summary',
    description:
      'Summarizes workspace achievements, pending goals, and high-level progress every Monday morning.',
    category: 'Productivity',
    badge: 'Weekly',
    iconName: 'Calendar',
    popularity: 90,
    estimatedTimeSaved: '2.5 hrs / week',
    preset: {
      name: 'Weekly Workspace Summary',
      description: 'Creates executive summary note every Monday morning',
      trigger: 'SCHEDULE',
      schedule: '0 9 * * 1',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Schedule: Mondays at 9:00 AM',
          triggerType: 'SCHEDULE',
          config: { cron: '0 9 * * 1' },
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Summarize Workspace Milestones',
          aiActionType: 'SUMMARIZE',
          config: { includeProjects: true, includeGoals: true },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Create Weekly Briefing Note',
          actionType: 'CREATE_KNOWLEDGE_ITEM',
          config: { title: 'Weekly Workspace Briefing & Roadmap' },
        },
      ],
    },
  },
  {
    id: 'tmpl-file-to-knowledge-processing',
    title: 'File-to-Knowledge Processing',
    description:
      'When a new file is uploaded, automatically extracts key concepts, tags content, and indexes it into Knowledge.',
    category: 'Knowledge',
    badge: 'AI Processing',
    iconName: 'BookOpen',
    popularity: 95,
    estimatedTimeSaved: '3.5 hrs / week',
    preset: {
      name: 'File-to-Knowledge Processing',
      description: 'Triggers on file upload to auto-classify and index into Knowledge',
      trigger: 'FILE_UPLOADED',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: File Uploaded',
          triggerType: 'FILE_UPLOADED',
          config: {},
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Classify & Extract File Metadata',
          aiActionType: 'CLASSIFY',
          config: { categories: ['PDF', 'Document', 'Report', 'Data'] },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Index into Knowledge Base',
          actionType: 'CREATE_KNOWLEDGE_ITEM',
          config: { title: 'Processed File Knowledge Entry' },
        },
      ],
    },
  },
  {
    id: 'tmpl-meeting-summary',
    title: 'Meeting Summary',
    description:
      'Extracts action items, decisions, and takeaways from calendar events into dedicated meeting notes.',
    category: 'AI',
    badge: 'Smart AI',
    iconName: 'Bot',
    popularity: 92,
    estimatedTimeSaved: '2.0 hrs / week',
    preset: {
      name: 'Meeting Summary',
      description: 'Extracts action items when calendar meetings finish',
      trigger: 'CALENDAR_EVENT',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: Calendar Event',
          triggerType: 'CALENDAR_EVENT',
          config: {},
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Extract Action Items & Key Decisions',
          aiActionType: 'EXTRACT',
          config: { entities: ['action_items', 'decisions', 'attendees'] },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Create Meeting Note',
          actionType: 'CREATE_KNOWLEDGE_ITEM',
          config: { title: 'Meeting Takeaways & Action Items' },
        },
      ],
    },
  },
  {
    id: 'tmpl-project-report-generator',
    title: 'Project Report Generator',
    description:
      'Generates a comprehensive Markdown project status report on demand, including active tasks and health metrics.',
    category: 'Projects',
    badge: 'On-Demand',
    iconName: 'Folder',
    popularity: 87,
    estimatedTimeSaved: '2.8 hrs / week',
    preset: {
      name: 'Project Report Generator',
      description: 'On-demand manual generation of comprehensive project status report',
      trigger: 'MANUAL',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Trigger: Manual Run',
          triggerType: 'MANUAL',
          config: {},
        },
        {
          id: 'step-2',
          type: 'ai_action',
          title: 'Synthesize Project Health & Metrics',
          aiActionType: 'ANALYZE',
          config: { scope: 'comprehensive_project_audit' },
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Create Project Status Report Note',
          actionType: 'CREATE_KNOWLEDGE_ITEM',
          config: { title: 'Comprehensive Project Status Report' },
        },
      ],
    },
  },
];
