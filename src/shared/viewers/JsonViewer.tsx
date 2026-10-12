import React, { useState, useMemo } from 'react';
import {
  FileJson,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Download,
} from 'lucide-react';

export interface JsonViewerProps {
  content: string;
  filename: string;
  downloadUrl?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ content, filename, downloadUrl }) => {
  const [viewMode, setViewMode] = useState<'structured' | 'raw'>('structured');
  const [copied, setCopied] = useState<boolean>(false);

  const parsedJson = useMemo(() => {
    try {
      return { data: JSON.parse(content), valid: true };
    } catch (err: any) {
      return { data: null, valid: false, error: err?.message || 'Invalid JSON format' };
    }
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-amber-400" />
          <span className="font-semibold text-slate-200 truncate max-w-xs">{filename}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
            {parsedJson.valid ? 'Valid JSON' : 'Malformed JSON'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-slate-800 p-0.5 bg-slate-950">
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              disabled={!parsedJson.valid}
              className={`rounded px-2.5 py-1 text-[11px] font-sans font-semibold transition-colors ${
                viewMode === 'structured'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 disabled:opacity-30'
              }`}
            >
              Structured
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`rounded px-2.5 py-1 text-[11px] font-sans font-semibold transition-colors ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-sans font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-sans font-semibold text-white hover:bg-indigo-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Body Viewport */}
      <div className="flex-1 overflow-auto p-4 max-h-[65vh]">
        {viewMode === 'structured' && parsedJson.valid ? (
          <JsonNode value={parsedJson.data} />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-slate-200">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};

// Recursive Structured JSON Node Component
const JsonNode: React.FC<{ value: any; name?: string; depth?: number }> = ({
  value,
  name,
  depth = 0,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(depth > 2);

  if (value === null) {
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        {name && <span className="text-slate-400">{name}: </span>}
        <span className="text-rose-400 font-bold">null</span>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        {name && <span className="text-slate-400">{name}: </span>}
        <span className="text-amber-400 font-bold">{value ? 'true' : 'false'}</span>
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        {name && <span className="text-slate-400">{name}: </span>}
        <span className="text-emerald-400 font-mono">{value}</span>
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        {name && <span className="text-slate-400">{name}: </span>}
        <span className="text-sky-300">"{value}"</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {name && <span className="text-indigo-400 font-semibold">{name}: </span>}
          <span className="text-slate-500">Array({value.length})</span>
        </button>

        {!collapsed && (
          <div className="border-l border-slate-800 ml-1.5 pl-1">
            {value.map((item, idx) => (
              <JsonNode key={idx} value={item} name={String(idx)} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return (
      <div className="py-0.5" style={{ paddingLeft: `${depth * 14}px` }}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {name && <span className="text-indigo-400 font-semibold">{name}: </span>}
          <span className="text-slate-500">{`{${keys.length} keys}`}</span>
        </button>

        {!collapsed && (
          <div className="border-l border-slate-800 ml-1.5 pl-1">
            {keys.map((k) => (
              <JsonNode key={k} value={value[k]} name={k} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};
