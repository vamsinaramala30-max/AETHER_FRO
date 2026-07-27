// frontend/src/knowledge/documents/FileUpload.tsx
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUploadComplete: (file: File, tags: string[]) => Promise<void> | void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setUploading(true);
    void (async () => {
      try {
        const parsedTags = tagsInput
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0);
        await onUploadComplete(file, parsedTags);
        setTagsInput('');
      } catch {
        alert('Asset injection state allocation fault.');
      } finally {
        setUploading(false);
      }
    })();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile !== undefined) {
      processFile(selectedFile);
    }
  };

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="space-y-1">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Assign Meta Tags to Incoming Uploads
        </label>
        <input
          type="text"
          placeholder="e.g. documentation, reference, spec"
          value={tagsInput}
          onChange={(e) => {
            setTagsInput(e.target.value);
          }}
          disabled={uploading}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={handleContainerClick}
        className={`flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-500/5'
            : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="animate-pulse space-y-2">
            <div className="font-mono text-xs text-amber-500">
              Streaming payload blocks to secure clusters...
            </div>
          </div>
        ) : (
          <>
            <span className="mb-1 text-xs font-medium text-white">
              Drag file payload here or click to mount
            </span>
            <span className="font-mono text-[10px] text-neutral-500">PDF, TXT, MD up to 25MB</span>
          </>
        )}
      </div>
    </div>
  );
};
