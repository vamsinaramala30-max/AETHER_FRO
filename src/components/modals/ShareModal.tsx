import React from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Link">
      <div className="space-y-4">
        <Input value={shareUrl} readOnly rightIcon={<Button size="sm" onClick={handleCopy}>Copy</Button>} />
      </div>
    </Modal>
  );
};