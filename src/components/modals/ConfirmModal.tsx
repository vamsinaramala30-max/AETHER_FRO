// @ts-nocheck
import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, description }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-text-secondary mb-6">{description}</p>
      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { onConfirm(); onClose(); }}>Confirm</Button>
      </div>
    </Modal>
  );
};