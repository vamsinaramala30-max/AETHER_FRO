import React, { useState } from 'react';
import { Task } from './taskService';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const hasDueDate = typeof dueDate === 'string' && dueDate.trim() !== '';
    onSubmit({
      title,
      description,
      status: 'todo',
      priority,
      dueDate: hasDueDate ? dueDate : undefined,
      tags,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTagInput('');
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'high' || val === 'medium' || val === 'low') {
      setPriority(val);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{
        background: '#161616',
        border: '1px solid #2d2d2d',
        borderRadius: '8px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Create New Architecture Task</h3>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        required
        style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.6rem',
          borderRadius: '4px',
        }}
      />

      <textarea
        placeholder="Task Execution Description..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.6rem',
          borderRadius: '4px',
          minHeight: '80px',
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Priority</label>
          <select
            value={priority}
            onChange={handlePriorityChange}
            style={{
              background: '#0a0a0a',
              border: '1px solid #333',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '4px',
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
            style={{
              background: '#0a0a0a',
              border: '1px solid #333',
              color: '#fff',
              padding: '0.45rem',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Tags (comma separated: ui, perf, core)"
        value={tagInput}
        onChange={(e) => {
          setTagInput(e.target.value);
        }}
        style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.6rem',
          borderRadius: '4px',
        }}
      />

      <button
        type="submit"
        style={{
          background: '#0066cc',
          color: '#fff',
          border: 'none',
          padding: '0.6rem',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        Commit Task
      </button>
    </form>
  );
};
