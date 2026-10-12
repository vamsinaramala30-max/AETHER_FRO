export type FileCategory =
  | 'All Files'
  | 'Documents'
  | 'Images'
  | 'PDFs'
  | 'Spreadsheets'
  | 'Presentations'
  | 'Code'
  | 'Audio'
  | 'Videos'
  | 'Media'
  | 'Archives'
  | 'Other';

export type FileManagerSection =
  | 'my-files'
  | 'recent'
  | 'projects'
  | 'shared'
  | 'trash';

export interface FileItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploadedAt?: string;
  updatedAt?: string;
  uploadedBy?: string;
  url?: string;
  storageKey?: string;
  checksum?: string;
  status: string;
  tags?: string[];
  folderId?: string | null;
  folder?: { id: string; name: string } | null;
  isFavorite?: boolean;
  favoriteId?: string;
  isTrash?: boolean;
  trashedAt?: string | null;
  versionCount?: number;
  type?: string;
  projectId?: string | null;
  isKnowledge?: boolean;
  extractedText?: string | null;
  description?: string | null;
  versions?: Array<{
    id: string;
    versionNumber: number;
    size: number;
    createdAt: string;
    description?: string;
  }>;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt?: string;
  fileCount?: number;
  subfolderCount?: number;
}

export interface FolderBreadcrumb {
  id: string | null;
  name: string;
}

export interface StorageCategoryInsight {
  name: string;
  bytes: number;
  count: number;
  percentage: number;
}

export interface StorageInsights {
  totalFiles: number;
  totalBytes: number;
  totalBytesStr?: string;
  categories: StorageCategoryInsight[];
  quotaBytes?: number;
  quotaBytesStr?: string;
  usedBytes?: number;
  usedBytesStr?: string;
  activeBytes?: number;
  activeBytesStr?: string;
  trashBytes?: number;
  trashBytesStr?: string;
  availableBytes?: number;
  availableBytesStr?: string;
  usagePercentage?: number;
}

export interface DuplicateGroup {
  stem: string;
  size: number;
  files: FileItem[];
}
