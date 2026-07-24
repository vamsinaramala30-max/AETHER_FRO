import React from 'react';
import { EventAttachment } from '../types/event';

interface EventAttachmentsProps {
  attachments: EventAttachment[];
  onAddAttachment: (attachment: EventAttachment) => void;
  onRemoveAttachment: (id: string) => void;
}

export const EventAttachments: React.FC<EventAttachmentsProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newAtt: EventAttachment = {
      id: `att_${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      mimeType: file.type,
      sizeInBytes: file.size,
    };
    onAddAttachment(newAtt);
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#3c4043' }}>Attachments</label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
        {attachments.map((att) => (
          <div
            key={att.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f1f3f4',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <a href={att.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1a73e8' }}>
              {att.name}
            </a>
            <button
              type="button"
              onClick={() => onRemoveAttachment(att.id)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#5f6368' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input type="file" onChange={handleFileChange} style={{ marginTop: '6px', fontSize: '12px' }} />
    </div>
  );
};