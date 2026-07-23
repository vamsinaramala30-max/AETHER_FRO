// @ts-nocheck
import React from 'react';
import { Modal } from '../ui/modal';
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
      <div className="flex justify-end mt-6 pt-4 border-t border-border-subtle">
        <Button variant="primary" onClick={onClose}>Save & Close</Button>
      </div>
    </Modal>
  );
};