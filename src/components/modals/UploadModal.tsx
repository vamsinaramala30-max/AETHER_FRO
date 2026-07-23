import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList | null) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Documents">
      <div className="border-2 border-dashed border-border-strong rounded-xl p-8 text-center space-y-3 bg-surface-subtle">
        <div className="text-3xl">📁</div>
        <p className="text-sm font-medium text-text-primary">Drag & drop files here or click to browse</p>
        <p className="text-xs text-text-tertiary">Supports PDF, DOCX, TXT up to 25MB</p>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            onUpload(e.target.files);
            onClose();
          }}
        />
        <label htmlFor="file-upload">
          <Button variant="secondary" size="sm" className="mt-2 cursor-pointer">
            Select Files
          </Button>
        </label>
      </div>
    </Modal>
  );
};