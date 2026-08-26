import {
  ApplicationState,
  BriefData,
  EngineEvent,
  NotificationPing,
  Patch,
  Rule,
  TaskBlock,
} from './types';
import { eventBus } from './EventBus';
import { DEFAULT_RULES } from './rules';
import { parseNaturalLanguageInput } from './nlParser';

type StateListener = (state: ApplicationState) => void;

/**
 * Initial sample schedule data for demonstration
 */
function createInitialSchedule(todayStr: string) {
  const tomorrowDate = new Date(todayStr);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const day4Date = new Date(todayStr);
  day4Date.setDate(day4Date.getDate() + 3);
  const day4Str = day4Date.toISOString().split('T')[0];

  const day7Date = new Date(todayStr);
  day7Date.setDate(day7Date.getDate() + 6);
  const day7Str = day7Date.toISOString().split('T')[0];

  return {
    [todayStr]: {
      sleepStart: 23,
      sleepEnd: 7,
      blocks: [
        {
          id: 'task-1',
          start: 9,
          duration: 90,
          label: 'DBMS Relational Algebra (Stage 1)',
          bucket: 'study',
          kind: 'flexible',
          subject: 'DBMS',
          priority: 'P0',
          energy: 'high',
          revision: { stage: 1 },
          groupId: 'group-dbms-1',
          completed: false,
        },
        {
          id: 'task-2',
          start: 11,
          duration: 60,
          label: 'Computer Networks Protocols',
          bucket: 'study',
          kind: 'flexible',
          subject: 'Computer Networks',
          priority: 'P1',
          energy: 'medium',
          revision: null,
          groupId: null,
          completed: false,
        },
        {
          id: 'task-3',
          start: 14.5,
          duration: 45,
          label: 'Operating Systems Scheduling',
          bucket: 'study',
          kind: 'flexible',
          subject: 'OS',
          priority: 'P1',
          energy: 'medium',
          revision: null,
          groupId: null,
          completed: false,
        },
        {
          id: 'task-fixed-1',
          start: 16.5,
          duration: 120,
          label: 'College DBMS Lab',
          bucket: 'other',
          kind: 'fixed',
          subject: 'DBMS',
          priority: 'P0',
          energy: 'medium',
          revision: null,
          groupId: null,
          completed: false,
        },
      ] as TaskBlock[],
    },
    [tomorrowStr]: {
      sleepStart: 23,
      sleepEnd: 7,
      blocks: [] as TaskBlock[],
    },
    [day4Str]: {
      sleepStart: 23,
      sleepEnd: 7,
      blocks: [] as TaskBlock[],
    },
    [day7Str]: {
      sleepStart: 23,
      sleepEnd: 7,
      blocks: [] as TaskBlock[],
    },
  };
}

export class RuleEngine {
  private static instance: RuleEngine;
  private state: ApplicationState;
  private rules: Rule[] = [...DEFAULT_RULES];
  private listeners: Set<StateListener> = new Set();
  private unsubscribeEventBus: (() => void) | null = null;

  private constructor() {
    const today = new Date().toISOString().split('T')[0];
    this.state = {
      simulatedTime: 8.5, // 08:30 AM default
      simulatedDate: today,
      daysSchedule: createInitialSchedule(today),
      criticalSubjects: ['Computer Networks'],
      activeBriefs: [],
      reminderLogs: [],
      pendingProposals: [],
      auditLogs: [],
    };

    this.init();
  }

  public static getInstance(): RuleEngine {
    if (!RuleEngine.instance) {
      RuleEngine.instance = new RuleEngine();
    }
    return RuleEngine.instance;
  }

  private init() {
    // Listen to all event bus events
    this.unsubscribeEventBus = eventBus.subscribe('*', (event) => {
      this.evaluateEvent(event);
    });
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach((fn) => fn(copy));
  }

  public getState(): ApplicationState {
    return { ...this.state };
  }

  public getRules(): Rule[] {
    return [...this.rules];
  }

  public toggleRule(ruleId: string, isEnabled?: boolean) {
    this.rules = this.rules.map((r) => {
      if (r.id === ruleId) {
        return { ...r, isEnabled: isEnabled !== undefined ? isEnabled : !r.isEnabled };
      }
      return r;
    });
    this.notify();
  }

  /**
   * Core Engine Event Evaluator
   */
  public evaluateEvent(event: EngineEvent) {
    const matchingRules = this.rules.filter((r) => r.isEnabled && r.trigger === event.type);

    for (const rule of matchingRules) {
      try {
        if (rule.condition(event, this.state)) {
          const patches = rule.action(event, this.state);

          if (patches.length > 0) {
            rule.runCount += 1;
            rule.lastRunAt = new Date().toLocaleTimeString();

            for (const patch of patches) {
              if (patch.requiresAcceptance || patch.status === 'pending') {
                // Add to pending proposals & audit log
                this.state.pendingProposals = [patch, ...this.state.pendingProposals];
                this.state.auditLogs = [patch, ...this.state.auditLogs];
              } else {
                // Apply patch directly and log
                const applied = this.executePatchApplication(patch);
                this.state.auditLogs = [{ ...applied, status: 'applied' }, ...this.state.auditLogs];
              }
            }
          }
        }
      } catch (err) {
        console.error(`[RuleEngine] Error executing rule ${rule.name}:`, err);
      }
    }

    this.notify();
  }

  /**
   * Directly executes state modification logic for an applied patch
   */
  private executePatchApplication(patch: Patch): Patch {
    const dateKey = patch.dateKey || this.state.simulatedDate;
    const daySchedule = this.state.daysSchedule[dateKey] || { sleepStart: 23, sleepEnd: 7, blocks: [] };

    switch (patch.type) {
      case 'CREATE_TASK': {
        const newTask: TaskBlock = patch.payload;
        const exists = daySchedule.blocks.some((b) => b.id === newTask.id);
        if (!exists) {
          this.state.daysSchedule[dateKey] = {
            ...daySchedule,
            blocks: [...daySchedule.blocks, newTask].sort((a, b) => a.start - b.start),
          };
        }
        break;
      }

      case 'UPDATE_TASK': {
        const { taskId, completed, missed, start } = patch.payload;
        this.state.daysSchedule[dateKey] = {
          ...daySchedule,
          blocks: daySchedule.blocks.map((b) => {
            if (b.id === taskId || b.id === patch.targetId) {
              return {
                ...b,
                completed: completed !== undefined ? completed : b.completed,
                missed: missed !== undefined ? missed : b.missed,
                start: start !== undefined ? start : b.start,
              };
            }
            return b;
          }),
        };
        break;
      }

      case 'REBUILD_SCHEDULE': {
        const { originalBlockId, updatedBlock } = patch.payload;
        this.state.daysSchedule[dateKey] = {
          ...daySchedule,
          blocks: daySchedule.blocks.map((b) => (b.id === originalBlockId ? { ...updatedBlock } : b)),
        };
        break;
      }

      case 'FLAG_CRITICAL_SUBJECT': {
        const { subject } = patch.payload;
        if (subject && !this.state.criticalSubjects.includes(subject)) {
          this.state.criticalSubjects = [...this.state.criticalSubjects, subject];
        }
        break;
      }

      case 'CREATE_BRIEF': {
        const newBrief: BriefData = patch.payload;
        if (!this.state.activeBriefs.some((b) => b.id === newBrief.id)) {
          this.state.activeBriefs = [newBrief, ...this.state.activeBriefs];
        }
        break;
      }

      case 'ADD_NOTIFICATION': {
        const ping: NotificationPing = patch.payload;
        if (!this.state.reminderLogs.some((r) => r.id === ping.id)) {
          this.state.reminderLogs = [ping, ...this.state.reminderLogs];
        }
        break;
      }
    }

    return { ...patch, status: 'applied' };
  }

  /**
   * One-click Undo Patch operation
   */
  public undoPatch(patchId: string) {
    const patch = this.state.auditLogs.find((p) => p.id === patchId);
    if (!patch || patch.status === 'undone') return;

    const dateKey = patch.dateKey || this.state.simulatedDate;
    const daySchedule = this.state.daysSchedule[dateKey];

    switch (patch.type) {
      case 'CREATE_TASK': {
        if (daySchedule) {
          const taskIdToRemove = patch.payload.id;
          this.state.daysSchedule[dateKey] = {
            ...daySchedule,
            blocks: daySchedule.blocks.filter((b) => b.id !== taskIdToRemove),
          };
        }
        break;
      }

      case 'REBUILD_SCHEDULE': {
        if (daySchedule && patch.undoPayload) {
          const { originalBlockId, originalStart } = patch.undoPayload;
          this.state.daysSchedule[dateKey] = {
            ...daySchedule,
            blocks: daySchedule.blocks.map((b) => (b.id === originalBlockId ? { ...b, start: originalStart, missed: false } : b)),
          };
        }
        break;
      }

      case 'FLAG_CRITICAL_SUBJECT': {
        const subject = patch.payload.subject;
        this.state.criticalSubjects = this.state.criticalSubjects.filter((s) => s !== subject);
        break;
      }

      case 'CREATE_BRIEF': {
        const briefId = patch.payload.id;
        this.state.activeBriefs = this.state.activeBriefs.filter((b) => b.id !== briefId);
        break;
      }

      case 'ADD_NOTIFICATION': {
        const pingId = patch.payload.id;
        this.state.reminderLogs = this.state.reminderLogs.filter((r) => r.id !== pingId);
        break;
      }
    }

    // Update status in audit logs and proposals
    this.state.auditLogs = this.state.auditLogs.map((p) => (p.id === patchId ? { ...p, status: 'undone' } : p));
    this.state.pendingProposals = this.state.pendingProposals.filter((p) => p.id !== patchId);

    this.notify();
  }

  /**
   * User accepts a proposal patch
   */
  public acceptProposal(patchId: string) {
    const proposal = this.state.pendingProposals.find((p) => p.id === patchId);
    if (!proposal) return;

    this.executePatchApplication(proposal);

    this.state.pendingProposals = this.state.pendingProposals.filter((p) => p.id !== patchId);
    this.state.auditLogs = this.state.auditLogs.map((p) => (p.id === patchId ? { ...p, status: 'applied' } : p));

    this.notify();
  }

  /**
   * User rejects a proposal patch
   */
  public rejectProposal(patchId: string) {
    this.state.pendingProposals = this.state.pendingProposals.filter((p) => p.id !== patchId);
    this.state.auditLogs = this.state.auditLogs.map((p) => (p.id === patchId ? { ...p, status: 'rejected' } : p));
    this.notify();
  }

  /**
   * Simulated Clock Controller Actions
   */
  public setSimulatedTime(decHour: number) {
    this.state.simulatedTime = Math.max(0, Math.min(24, decHour));
    this.notify();

    // Trigger time tick event
    eventBus.publish({
      type: 'time.tick',
      timestamp: new Date().toISOString(),
      payload: {
        simulatedTime: this.state.simulatedTime,
        simulatedDate: this.state.simulatedDate,
      },
    });
  }

  public setSimulatedDate(dateKey: string) {
    this.state.simulatedDate = dateKey;
    if (!this.state.daysSchedule[dateKey]) {
      this.state.daysSchedule[dateKey] = { sleepStart: 23, sleepEnd: 7, blocks: [] };
    }
    this.notify();
  }

  /**
   * User action: Complete task with confidence score (1-5)
   */
  public completeTaskWithConfidence(taskId: string, confidence: number) {
    const dateKey = this.state.simulatedDate;
    const schedule = this.state.daysSchedule[dateKey];
    if (!schedule) return;

    let targetTask: TaskBlock | null = null;
    this.state.daysSchedule[dateKey] = {
      ...schedule,
      blocks: schedule.blocks.map((b) => {
        if (b.id === taskId) {
          targetTask = { ...b, completed: true, confidence };
          return targetTask;
        }
        return b;
      }),
    };

    if (targetTask) {
      eventBus.publish({
        type: 'task.completed',
        timestamp: new Date().toISOString(),
        payload: {
          task: targetTask,
          confidence,
        },
      });
    }

    this.notify();
  }

  /**
   * Dispatch Natural Language Intake string
   */
  public dispatchNaturalLanguageInput(rawText: string) {
    const parsedIntent = parseNaturalLanguageInput(rawText, this.state.simulatedDate);

    eventBus.publish({
      type: 'nl.input_parsed',
      timestamp: new Date().toISOString(),
      payload: {
        parsedIntent,
      },
    });

    return parsedIntent;
  }

  /**
   * Dismiss brief card
   */
  public dismissBrief(briefId: string) {
    this.state.activeBriefs = this.state.activeBriefs.map((b) => (b.id === briefId ? { ...b, dismissed: true } : b));
    this.notify();
  }
}

export const ruleEngine = RuleEngine.getInstance();
