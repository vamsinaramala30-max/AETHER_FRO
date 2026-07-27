import { BaseEntity, ID } from './common';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task extends BaseEntity {
  projectId: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: ID;
  dueDate?: string;
}

export interface Project extends BaseEntity {
  name: string;
  key: string;
  description?: string;
  ownerId: ID;
  taskCount?: number;
  membersCount?: number;
}
