import React, { useState } from 'react';
import { Participant } from '../types/participant';

interface ParticipantSelectorProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
}

export const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
}) => {
  const [emailInput, setEmailInput] = useState('');

  const handleAdd = () => {
    if (!emailInput.trim() || !emailInput.includes('@')) return;

    const namePart = emailInput.split('@')[0] ?? emailInput;

    const newP: Participant = {
      id: `p_${String(Date.now())}`,
      email: emailInput.trim(),
      displayName: namePart,
      status: 'needsAction',
      role: 'required',
    };

    onAddParticipant(newP);
    setEmailInput('');
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#3c4043' }}>
        Guests / Participants
      </label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
        <input
          type="email"
          placeholder="Add guest email..."
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
          }}
          style={{ flex: 1, padding: '6px 8px', border: '1px solid #dadce0', borderRadius: '4px' }}
        />
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: '6px 12px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Add
        </button>
      </div>

      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {participants.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <span>
              {p.displayName} ({p.email})
            </span>
            <button
              type="button"
              onClick={() => {
                onRemoveParticipant(p.id);
              }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d93025' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
