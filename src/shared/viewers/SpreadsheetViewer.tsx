import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

export interface SpreadsheetViewerProps {
  content?: string;
  filename: string;
  downloadUrl?: string;
}

interface ParsedSheet {
  name: string;
  rows: string[][];
}

export const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({
  content = '',
  filename,
  downloadUrl,
}) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColIndex, setSortColIndex] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Parse sheets structure (supports multi-sheet === Sheet N === markers or standard CSV/TSV)
  const sheets: ParsedSheet[] = useMemo(() => {
    if (!content) return [{ name: 'Sheet 1', rows: [] }];

    // Check for multi-sheet separator (e.g. from office text extractor: === Sheet Name ===)
    const sheetSections = content.split(/=== ([^=]+) ===\r?\n/);
    if (sheetSections.length > 1) {
      const parsed: ParsedSheet[] = [];
      for (let i = 1; i < sheetSections.length; i += 2) {
        const sheetName = sheetSections[i].trim();
        const sheetData = sheetSections[i + 1] || '';
        const rows = sheetData
          .split(/\r?\n/)
          .filter((l) => l.trim().length > 0)
          .map((line) => line.split('\t').map((c) => c.trim()));
        parsed.push({ name: sheetName, rows });
      }
      return parsed.length > 0 ? parsed : [{ name: 'Sheet 1', rows: [] }];
    }

    // Standard CSV / TSV Parsing
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const isTab = filename.toLowerCase().endsWith('.tsv') || (lines[0] && lines[0].includes('\t') && !lines[0].includes(','));
    const delimiter = isTab ? '\t' : ',';

    const rows = lines.map((line) => {
      if (isTab) return line.split('\t').map((c) => c.trim().replace(/^"|"$/g, ''));

      // CSV parser handling quoted cells
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          cells.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim().replace(/^"|"$/g, ''));
      return cells;
    });

    return [{ name: 'Sheet 1', rows }];
  }, [content, filename]);

  const activeSheet = sheets[activeSheetIndex] || sheets[0];
  const allRows = useMemo(() => activeSheet?.rows || [], [activeSheet]);
  const headerRow = allRows.length > 0 ? allRows[0] : [];

  // Filter and sort
  const displayRows = useMemo(() => {
    const dataRows = allRows.length > 1 ? allRows.slice(1) : [];
    let result = [...dataRows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => row.some((cell) => cell.toLowerCase().includes(q)));
    }

    if (sortColIndex !== null) {
      result.sort((a, b) => {
        const valA = a[sortColIndex] || '';
        const valB = b[sortColIndex] || '';
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortAsc ? numA - numB : numB - numA;
        }
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return result;
  }, [allRows, searchQuery, sortColIndex, sortAsc]);

  const handleSort = (colIndex: number) => {
    if (sortColIndex === colIndex) {
      setSortAsc(!sortAsc);
    } else {
      setSortColIndex(colIndex);
      setSortAsc(true);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{filename}</span>
          <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
            {allRows.length} rows • {headerRow.length} cols
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Table */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table..."
              className="h-7 w-36 rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            {searchQuery && (
              <span className="ml-1.5 text-[10px] text-slate-500">
                {displayRows.length} found
              </span>
            )}
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow hover:bg-emerald-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Sheets Navigation Tabs (If Multiple Sheets exist) */}
      {sheets.length > 1 && (
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100/60 px-4 py-1.5 overflow-x-auto dark:border-slate-800 dark:bg-slate-950/60">
          <Layers className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
          {sheets.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveSheetIndex(idx);
                setSortColIndex(null);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors shrink-0 ${
                activeSheetIndex === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {s.name} ({s.rows.length})
            </button>
          ))}
        </div>
      )}

      {/* Interactive Table Viewport: strictly scrolls HORIZONTALLY inside its container only! */}
      <div className="relative flex-1 overflow-auto max-h-[60vh] w-full">
        <table className="min-w-full border-collapse text-left">
          {headerRow.length > 0 && (
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 shadow-xs">
              <tr>
                <th className="w-10 border-r border-slate-200 px-2 py-2 text-center text-[10px] text-slate-400 dark:border-slate-700 select-none">
                  #
                </th>
                {headerRow.map((head, cIdx) => (
                  <th
                    key={cIdx}
                    onClick={() => handleSort(cIdx)}
                    className="cursor-pointer border-r border-slate-200 px-3 py-2 text-xs hover:bg-slate-200/60 dark:border-slate-700 dark:hover:bg-slate-700/60 whitespace-nowrap select-none"
                    title="Click to sort column"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{head || `Col ${cIdx + 1}`}</span>
                      <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
            {displayRows.length > 0 ? (
              displayRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="border-r border-slate-100 px-2 py-1.5 text-center text-[10px] text-slate-400 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 select-none">
                    {rIdx + 1}
                  </td>
                  {headerRow.map((_, cIdx) => {
                    const cell = row[cIdx] || '';
                    return (
                      <td
                        key={cIdx}
                        className="border-r border-slate-100 px-3 py-1.5 text-slate-700 dark:text-slate-300 dark:border-slate-800 whitespace-nowrap max-w-sm truncate"
                        title={cell}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headerRow.length + 1} className="py-12 text-center text-slate-400">
                  {searchQuery ? 'No matching rows found.' : 'No data rows available in sheet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
