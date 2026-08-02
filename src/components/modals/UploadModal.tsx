import React from 'react';
import { Modal } from '../ui/model';
import { Button } from '../ui/button';

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList | null) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Documents">
      <div className="space-y-3 rounded-xl border-2 border-dashed border-border-strong bg-surface-subtle p-8 text-center">
        <div className="text-3xl">📁</div>
        <p className="text-sm font-medium text-text-primary">
          Drag & drop files here or click to browse
        </p>
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
