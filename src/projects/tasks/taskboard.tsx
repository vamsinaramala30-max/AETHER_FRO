
import React from 'react';
import { Task } from './taskservice';
import { TaskCard } from './taskcard';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, nextStatus: Task['status']) => void;
}

const COLUMNS: { id: Task['status']; title: string }[] = [
  { id: 'todo', title: 'To Do Blueprint' },
  { id: 'in_progress', title: 'In Execution' },
  { id: 'review', title: 'Validation & Review' },
  { id: 'done', title: 'Production Ready' }
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onStatusChange }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} style={{ background: '#141414', borderRadius: '8px', padding: '1rem', border: '1px solid #222', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2d2d2d', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{col.title}</h3>
              <span style={{ background: '#2a2a2a', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>{columnTasks.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              {columnTasks.length === 0 ? (
                <div style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic', border: '1px dashed #222', borderRadius: '6px' }}>
                  No tasks active
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};