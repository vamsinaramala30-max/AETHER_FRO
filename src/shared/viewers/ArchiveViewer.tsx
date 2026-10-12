import React, { useState, useEffect, useMemo } from 'react';
import {
  Archive,
  Folder,
  File,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { formatFileSize } from '../fileCapabilityDetector';

export interface ArchiveEntry {
  path: string;
  size?: number;
  isDir?: boolean;
}

export interface ArchiveViewerProps {
  url: string;
  filename: string;
  size?: number;
  downloadUrl?: string;
}

interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
  children: Record<string, TreeNode>;
}

export const ArchiveViewer: React.FC<ArchiveViewerProps> = ({
  url,
  filename,
  size,
  downloadUrl,
}) => {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const sep = url.includes('?') ? '&' : '?';
    fetch(`${url}${sep}inspect=true`)
      .then((res) => {
        if (!res.ok) throw new Error('Inspection not supported');
        return res.json();
      })
      .then((payload) => {
        const data = payload?.data || payload;
        if (data?.entries && Array.isArray(data.entries)) {
          setEntries(data.entries);
        } else {
          setEntries([]);
        }
      })
      .catch(() => {
        // Fallback: empty entries list
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, [url]);

  // Build hierarchical tree
  const treeRoot = useMemo(() => {
    const root: TreeNode = { name: '', path: '', isDir: true, children: {} };

    for (const entry of entries) {
      const parts = entry.path.split('/').filter(Boolean);
      let curr = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        if (!curr.children[part]) {
          curr.children[part] = {
            name: part,
            path: parts.slice(0, i + 1).join('/'),
            isDir: !isLast || !!entry.isDir,
            size: isLast ? entry.size : undefined,
            children: {},
          };
        }
        curr = curr.children[part];
      }
    }

    return root;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.path.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-mono">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <Archive className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="font-semibold text-slate-200 truncate max-w-xs">{filename}</span>
          {size && size > 0 && (
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
              {formatFileSize(size)}
            </span>
          )}
          <span className="rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold font-sans">
            Protected Sandbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter entries..."
                className="h-7 w-36 rounded-lg border border-slate-800 bg-slate-950 pl-7 pr-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 font-sans text-xs font-semibold text-white shadow hover:bg-amber-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Archive</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Archive Tree Body */}
      <div className="flex-1 overflow-auto p-4 max-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="mt-2 text-xs">Inspecting compressed directory entries...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <Archive className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">Compressed Archive Container</p>
            <p className="mt-1 max-w-sm text-xs text-slate-500 font-sans leading-relaxed">
              This archive format ({filename.split('.').pop()?.toUpperCase()}) is securely stored in AETHER. Download the archive to extract its contents on your device.
            </p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={filename}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 font-sans text-xs font-semibold text-white shadow hover:bg-amber-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Archive</span>
              </a>
            )}
          </div>
        ) : searchQuery.trim() ? (
          // Flat filtered list
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 mb-2">
              Found {filteredEntries.length} matching item(s):
            </p>
            {filteredEntries.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded px-2 py-1 hover:bg-slate-900"
              >
                <div className="flex items-center gap-2 truncate">
                  {e.isDir ? (
                    <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <File className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="text-slate-200 truncate">{e.path}</span>
                </div>
                {e.size !== undefined && e.size > 0 && (
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                    {formatFileSize(e.size)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Full Directory Hierarchy Tree
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-900 mb-2">
              Archive Index • {entries.length} items
            </div>
            {Object.values(treeRoot.children).map((node) => (
              <ArchiveTreeNode key={node.path} node={node} depth={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ArchiveTreeNode: React.FC<{ node: TreeNode; depth: number }> = ({ node, depth }) => {
  const [open, setOpen] = useState<boolean>(depth < 1);
  const hasChildren = Object.keys(node.children).length > 0;

  if (node.isDir) {
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-slate-300 hover:bg-slate-900 select-none"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              open ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )
            ) : (
              <div className="w-3.5" />
            )}
            <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-200">{node.name}</span>
          </div>
        </div>

        {open && hasChildren && (
          <div>
            {Object.values(node.children).map((child) => (
              <ArchiveTreeNode key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between rounded px-2 py-0.5 text-slate-300 hover:bg-slate-900"
      style={{ paddingLeft: `${depth * 14 + 22}px` }}
    >
      <div className="flex items-center gap-1.5 truncate">
        <File className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        <span className="text-slate-300 truncate">{node.name}</span>
      </div>
      {node.size !== undefined && node.size > 0 && (
        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
          {formatFileSize(node.size)}
        </span>
      )}
    </div>
  );
};
