import React from 'react';
import { Modal } from '../ui/model';
import { Button } from '../ui/button';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="lg">
      <div className="space-y-4">{children}</div>
      <div className="mt-6 flex justify-end border-t border-border-subtle pt-4">
        <Button variant="primary" onClick={onClose}>
          Save & Close
        </Button>
      </div>
    </Modal>
  );
};
