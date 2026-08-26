/**
 * Types for AETHER OS Rule Engine & Event System
 */

export type TriggerEventType =
  | 'task.completed'
  | 'task.missed'
  | 'time.tick'
  | 'day.started'
  | 'day.ended'
  | 'task.created'
  | 'schedule.rebuild_requested'
  | 'nl.input_parsed';

export interface EngineEvent {
  type: TriggerEventType;
  timestamp: string;
  payload: Record<string, any>;
}

export type PatchStatus = 'pending' | 'applied' | 'undone' | 'rejected';

export interface Patch {
  id: string;
  ruleId: string;
  ruleName: string;
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'FLAG_CRITICAL_SUBJECT' | 'CREATE_BRIEF' | 'REBUILD_SCHEDULE' | 'ADD_NOTIFICATION';
  targetId?: string;
  dateKey?: string;
  description: string;
  reason: string;
  timestamp: string;
  status: PatchStatus;
  payload: any;
  undoPayload?: any;
  requiresAcceptance?: boolean;
}

export interface TaskBlock {
  id: string;
  start: number;        // decimal hour, e.g. 18.5 = 18:30
  duration: number;     // minutes
  label: string;
  bucket: 'study' | 'other';
  kind: 'fixed' | 'flexible';
  subject: string | null;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | null;
  energy: 'high' | 'medium' | 'low' | null;
  revision: { stage: 1 | 4 | 7 } | null;
  groupId: string | null;
  completed: boolean;
  missed?: boolean;
  confidence?: number;
  isCriticalTopic?: boolean;
}

export interface DaySchedule {
  sleepStart: number;
  sleepEnd: number;
  blocks: TaskBlock[];
}

export type DaysScheduleMap = Record<string, DaySchedule>;

export interface ApplicationState {
  simulatedTime: number; // decimal hour 0-24
  simulatedDate: string; // YYYY-MM-DD
  daysSchedule: DaysScheduleMap;
  criticalSubjects: string[];
  activeBriefs: BriefData[];
  reminderLogs: NotificationPing[];
  pendingProposals: Patch[];
  auditLogs: Patch[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'Spaced Repetition' | 'Schedule Rebuild' | 'Reminders' | 'Daily Briefs' | 'Knowledge' | 'Intake';
  trigger: TriggerEventType;
  condition: (event: EngineEvent, state: ApplicationState) => boolean;
  action: (event: EngineEvent, state: ApplicationState) => Patch[];
  isEnabled: boolean;
  runCount: number;
  lastRunAt?: string | null;
}

export interface NotificationPing {
  id: string;
  taskId: string;
  taskLabel: string;
  type: 'T-15m' | 'T-0m' | 'T+20m';
  message: string;
  timestamp: string;
  simulatedTime: string;
  read: boolean;
}

export interface BriefData {
  id: string;
  type: 'morning' | 'evening' | 'night';
  title: string;
  subtitle: string;
  dateKey: string;
  timestamp: string;
  dismissed: boolean;
  highlights: string[];
  metrics: {
    plannedStudyHours: number;
    completedTasks: number;
    pendingTasks: number;
    sleepHours: number;
    criticalCount: number;
  };
}

export interface ClockState {
  currentSimulatedDecHour: number; // e.g. 14.5
  currentDateKey: string;          // YYYY-MM-DD
  speedMultiplier: number;         // 1, 5, 60, 300
  isRunning: boolean;
}

export interface ParsedIntent {
  intentType: 'addFixedBlock' | 'completeTask' | 'querySchedule' | 'unknown';
  rawText: string;
  confidence: number;
  extracted: {
    label?: string;
    subject?: string;
    startHour?: number;
    endHour?: number;
    dateKey?: string;
    priority?: 'P0' | 'P1' | 'P2' | 'P3';
    energy?: 'high' | 'medium' | 'low';
  };
}
