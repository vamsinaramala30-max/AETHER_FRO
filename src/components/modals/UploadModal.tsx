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
      <div className="border-border-strong bg-surface-subtle space-y-3 rounded-xl border-2 border-dashed p-8 text-center">
        <div className="text-3xl">📁</div>
        <p className="text-text-primary text-sm font-medium">
          Drag & drop files here or click to browse
        </p>
        <p className="text-text-tertiary text-xs">Supports PDF, DOCX, TXT up to 25MB</p>
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
