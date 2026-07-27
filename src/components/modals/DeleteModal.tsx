import React from 'react';
import { Modal } from '../ui/model';
import { Button } from '../ui/button';

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Item">
      <p className="text-text-secondary mb-6 text-sm">
        Are you sure you want to delete{' '}
        <span className="text-text-primary font-semibold">{itemName}</span>? This action cannot be
        undone.
      </p>
      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
