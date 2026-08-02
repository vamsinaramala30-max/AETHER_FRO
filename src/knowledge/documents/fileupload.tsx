// frontend/src/knowledge/documents/FileUpload.tsx
import React, { useState, useRef } from 'react';
import { UploadCloud, Tag } from 'lucide-react';

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
        alert('File upload failed.');
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
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Tag className="h-3.5 w-3.5 text-indigo-500" />
          Assign Tags to Uploads
        </label>
        <input
          type="text"
          placeholder="e.g. documentation, reference, spec"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          disabled={uploading}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={handleContainerClick}
        className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10'
            : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-indigo-500'
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
          <div className="animate-pulse space-y-2 text-center">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Uploading document...
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PDF, TXT, MD, DOCX up to 25MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
