import React from 'react';

export const KeyboardShortcutsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li>
            <strong>D</strong>: Day View
          </li>
          <li>
            <strong>W</strong>: Week View
          </li>
          <li>
            <strong>M</strong>: Month View
          </li>
          <li>
            <strong>Y</strong>: Year View
          </li>
          <li>
            <strong>A</strong>: Agenda View
          </li>
        </ul>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
