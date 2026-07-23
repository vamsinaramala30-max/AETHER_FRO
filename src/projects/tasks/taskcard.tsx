import React from 'react';
import { Task } from './taskService';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, nextStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const priorityColor = { high: '#ff4d4d', medium: '#ffaa00', low: '#00cc66' }[task.priority];

  return (
    <div style={{ background: '#1e1e1e', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f5f5f5' }}>{task.title}</h4>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: `${priorityColor}22`, color: priorityColor, border: `1px solid ${priorityColor}44`, fontWeight: 'bold' }}>
          {task.priority}
        </span>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa', lineHeight: 1.4 }}>{task.description}</p>
      
      {task.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {task.tags.map(tag => (
            <span key={tag} style={{ background: '#2d2d2d', color: '#ccc', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #2d2d2d' }}>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>{task.dueDate || 'No due date'}</span>
        <select
          value={task.status}
          onChange={(e) => { onStatusChange(task.id, e.target.value as any); }}
          style={{ background: '#111', border: '1px solid #444', color: '#ccc', fontSize: '0.8rem', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer' }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};