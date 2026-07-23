// frontend/src/knowledge/documents/FileUpload.tsx
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUploadComplete: (file: File, tags: string[]) => Promise<void>;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const parsedTags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      await onUploadComplete(file, parsedTags);
      setTagsInput('');
    } catch {
      alert('Asset injection state allocation fault.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Assign Meta Tags to Incoming Uploads</label>
        <input
          type="text"
          placeholder="e.g. documentation, reference, spec"
          value={tagsInput}
          onChange={(e) => { setTagsInput(e.target.value); }}
          disabled={uploading}
          className="w-full bg-neutral-950 text-white border border-neutral-800 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500 text-xs"
        />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => { setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
        className={`h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
          isDragging ? 'border-amber-500 bg-amber-500/5' : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
        }`}
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0]); }} disabled={uploading} />
        
        {uploading ? (
          <div className="space-y-2 animate-pulse">
            <div className="text-amber-500 font-mono text-xs">Streaming payload blocks to secure clusters...</div>
          </div>
        ) : (
          <>
            <span className="text-xs text-white font-medium mb-1">Drag file payload here or click to mount</span>
            <span className="text-[10px] text-neutral-500 font-mono">PDF, TXT, MD up to 25MB</span>
          </>
        )}
      </div>
    </div>
  );
};