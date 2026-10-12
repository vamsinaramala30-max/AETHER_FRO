/**
 * AETHER OS — Universal File Capability Detector
 * Centralized file type, category, and preview capability detection.
 */

export type FileViewerType =
  | 'image'
  | 'pdf'
  | 'text'
  | 'code'
  | 'markdown'
  | 'json'
  | 'csv'
  | 'spreadsheet'
  | 'docx'
  | 'pptx'
  | 'presentation'
  | 'audio'
  | 'video'
  | 'archive'
  | 'unsupported';

export type FileCategory =
  | 'Images'
  | 'Documents'
  | 'PDFs'
  | 'Spreadsheets'
  | 'Presentations'
  | 'Code'
  | 'Videos'
  | 'Audio'
  | 'Archives'
  | 'Other';

export interface FileItemLike {
  id?: string;
  filename?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  downloadUrl?: string;
  previewUrl?: string;
  content?: string;
  extension?: string;
  detectedMimeType?: string;
}

// Map extensions to viewer types
const EXTENSION_VIEWER_MAP: Record<string, FileViewerType> = {
  // Images
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.bmp': 'image',
  '.tiff': 'image',
  '.tif': 'image',
  '.ico': 'image',
  '.avif': 'image',

  // PDF
  '.pdf': 'pdf',

  // Markdown
  '.md': 'markdown',
  '.markdown': 'markdown',

  // Spreadsheets
  '.csv': 'spreadsheet',
  '.tsv': 'spreadsheet',
  '.xls': 'spreadsheet',
  '.xlsx': 'spreadsheet',
  '.ods': 'spreadsheet',

  // Word Documents
  '.docx': 'docx',
  '.doc': 'docx',
  '.odt': 'docx',
  '.rtf': 'text',

  // Presentations
  '.pptx': 'presentation',
  '.ppt': 'presentation',
  '.odp': 'presentation',

  // Audio
  '.mp3': 'audio',
  '.wav': 'audio',
  '.ogg': 'audio',
  '.m4a': 'audio',
  '.flac': 'audio',
  '.aac': 'audio',

  // Video
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video',
  '.avi': 'video',
  '.mkv': 'video',

  // Archives
  '.zip': 'archive',
  '.rar': 'archive',
  '.7z': 'archive',
  '.tar': 'archive',
  '.gz': 'archive',
  '.tgz': 'archive',

  // Code & Structured Data
  '.js': 'code',
  '.mjs': 'code',
  '.cjs': 'code',
  '.ts': 'code',
  '.jsx': 'code',
  '.tsx': 'code',
  '.json': 'json',
  '.xml': 'code',
  '.html': 'code',
  '.htm': 'code',
  '.css': 'code',
  '.scss': 'code',
  '.sass': 'code',
  '.less': 'code',
  '.py': 'code',
  '.java': 'code',
  '.c': 'code',
  '.cpp': 'code',
  '.cc': 'code',
  '.h': 'code',
  '.hpp': 'code',
  '.cs': 'code',
  '.go': 'code',
  '.rs': 'code',
  '.php': 'code',
  '.sql': 'code',
  '.sh': 'code',
  '.bash': 'code',
  '.zsh': 'code',
  '.yaml': 'code',
  '.yml': 'code',
  '.env': 'code',
  '.toml': 'code',
  '.ini': 'code',
  '.conf': 'code',
  '.txt': 'text',
  '.log': 'text',
};

export function getFileExtension(filename?: string): string {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Determine the exact FileViewerType using MIME type, filename, extension, and content hints.
 */
export function getFileViewerType(
  fileOrName: string | FileItemLike | null | undefined,
): FileViewerType {
  if (!fileOrName) return 'unsupported';

  const file: FileItemLike =
    typeof fileOrName === 'string' ? { filename: fileOrName } : fileOrName;

  const name = file.filename || file.name || '';
  const ext = file.extension?.toLowerCase() || getFileExtension(name);
  const mime = (file.detectedMimeType || file.mimeType || '').toLowerCase();

  // 1. Direct extension match if high confidence
  if (ext && EXTENSION_VIEWER_MAP[ext]) {
    return EXTENSION_VIEWER_MAP[ext];
  }

  // 2. MIME type inspection
  if (mime.startsWith('image/')) return 'image';
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'application/json' || mime.endsWith('+json')) return 'json';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'text/markdown' || mime === 'text/x-markdown') return 'markdown';
  if (
    mime === 'text/csv' ||
    mime === 'text/tab-separated-values' ||
    mime === 'text/tsv' ||
    mime.includes('spreadsheetml') ||
    mime.includes('ms-excel') ||
    mime.includes('oasis.opendocument.spreadsheet')
  ) {
    return 'spreadsheet';
  }
  if (
    mime.includes('wordprocessingml') ||
    mime.includes('msword') ||
    mime.includes('oasis.opendocument.text')
  ) {
    return 'docx';
  }
  if (
    mime.includes('presentationml') ||
    mime.includes('ms-powerpoint') ||
    mime.includes('oasis.opendocument.presentation')
  ) {
    return 'presentation';
  }
  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('tar') ||
    mime.includes('gzip') ||
    mime.includes('rar')
  ) {
    return 'archive';
  }
  if (
    mime.startsWith('text/') ||
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('xml') ||
    mime.includes('yaml') ||
    mime.includes('sql')
  ) {
    return 'code';
  }

  // Special files without extensions like Dockerfile
  if (name.toLowerCase() === 'dockerfile' || name.toLowerCase() === 'makefile') {
    return 'code';
  }

  // 3. Fallback to text if file has text content loaded
  if (typeof file.content === 'string') {
    return 'text';
  }

  return 'unsupported';
}

/**
 * Categorize file into top-level AETHER Category.
 */
export const getViewerTypeForFile = getFileViewerType;

export function getFileCategory(
  fileOrName: string | FileItemLike | null | undefined,
): FileCategory {
  const viewerType = getFileViewerType(fileOrName);
  switch (viewerType) {
    case 'image':
      return 'Images';
    case 'pdf':
      return 'PDFs';
    case 'docx':
    case 'text':
    case 'markdown':
      return 'Documents';
    case 'csv':
    case 'spreadsheet':
      return 'Spreadsheets';
    case 'pptx':
    case 'presentation':
      return 'Presentations';
    case 'json':
    case 'code':
      return 'Code';
    case 'video':
      return 'Videos';
    case 'audio':
      return 'Audio';
    case 'archive':
      return 'Archives';
    default:
      return 'Other';
  }
}

/**
 * Format raw byte size into human readable string.
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formatted = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${parseFloat(formatted)} ${units[i]}`;
}

/**
 * Check if the file format can be opened in the AETHER Editor.
 */
export function isEditableFile(
  fileOrName: string | FileItemLike | null | undefined,
): boolean {
  const type = getFileViewerType(fileOrName);
  return (
    type === 'text' ||
    type === 'code' ||
    type === 'markdown' ||
    type === 'csv' ||
    type === 'json' ||
    type === 'spreadsheet'
  );
}

/**
 * Comprehensive capability descriptor for a file.
 */
export function detectFileCapability(
  filenameOrFile: string | FileItemLike,
  mimeType?: string,
) {
  const fileObj: FileItemLike =
    typeof filenameOrFile === 'string'
      ? { filename: filenameOrFile, mimeType }
      : filenameOrFile;
  const viewerType = getFileViewerType(fileObj);
  const category = getFileCategory(fileObj);
  const canEdit = isEditableFile(fileObj);
  const canPreview = viewerType !== 'unsupported';

  return {
    viewerType,
    category,
    canPreview,
    canEdit,
  };
}
