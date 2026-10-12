import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  detectFileCapability,
  formatFileSize,
  getViewerTypeForFile,
  isEditableFile,
} from '@/shared/fileCapabilityDetector';
import { fileManagerApi } from '@/projects/files/fileManagerApi';

describe('Universal File Viewer & Capability Detector Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('detectFileCapability Matrix', () => {
    it('correctly classifies standard raster and vector images', () => {
      const pngCap = detectFileCapability('photo.png', 'image/png');
      expect(pngCap.viewerType).toBe('image');
      expect(pngCap.category).toBe('Images');
      expect(pngCap.canPreview).toBe(true);
      expect(pngCap.canEdit).toBe(false);

      const svgCap = detectFileCapability('icon.svg', 'image/svg+xml');
      expect(svgCap.viewerType).toBe('image');
      expect(svgCap.category).toBe('Images');

      const webpCap = detectFileCapability('banner.webp', 'image/webp');
      expect(webpCap.viewerType).toBe('image');
      expect(webpCap.canPreview).toBe(true);
    });

    it('correctly classifies PDF documents', () => {
      const cap = detectFileCapability('Contract.pdf', 'application/pdf');
      expect(cap.viewerType).toBe('pdf');
      expect(cap.category).toBe('PDFs');
      expect(cap.canPreview).toBe(true);
      expect(cap.canEdit).toBe(false);
    });

    it('correctly classifies Code and Plain Text with editability', () => {
      const tsxCap = detectFileCapability('App.tsx', 'text/typescript');
      expect(tsxCap.viewerType).toBe('code');
      expect(tsxCap.category).toBe('Code');
      expect(tsxCap.canEdit).toBe(true);

      const pyCap = detectFileCapability('model_train.py', 'text/x-python');
      expect(pyCap.viewerType).toBe('code');
      expect(pyCap.category).toBe('Code');
      expect(pyCap.canEdit).toBe(true);

      const txtCap = detectFileCapability('notes.txt', 'text/plain');
      expect(txtCap.viewerType).toBe('text');
      expect(txtCap.category).toBe('Documents');
      expect(txtCap.canEdit).toBe(true);
    });

    it('correctly classifies JSON documents', () => {
      const cap = detectFileCapability('config.json', 'application/json');
      expect(cap.viewerType).toBe('json');
      expect(cap.category).toBe('Code');
      expect(cap.canPreview).toBe(true);
      expect(cap.canEdit).toBe(true);
    });

    it('correctly classifies CSV, TSV, and XLSX spreadsheets', () => {
      const csvCap = detectFileCapability('q3_financials.csv', 'text/csv');
      expect(csvCap.viewerType).toBe('spreadsheet');
      expect(csvCap.category).toBe('Spreadsheets');
      expect(csvCap.canPreview).toBe(true);

      const xlsxCap = detectFileCapability(
        'budget.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(xlsxCap.viewerType).toBe('spreadsheet');
      expect(xlsxCap.category).toBe('Spreadsheets');
    });

    it('correctly classifies DOCX and Word documents', () => {
      const cap = detectFileCapability(
        'Proposal.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      expect(cap.viewerType).toBe('docx');
      expect(cap.category).toBe('Documents');
      expect(cap.canPreview).toBe(true);
    });

    it('correctly classifies Presentations (PPTX)', () => {
      const cap = detectFileCapability(
        'PitchDeck.pptx',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      );
      expect(cap.viewerType).toBe('presentation');
      expect(cap.category).toBe('Presentations');
      expect(cap.canPreview).toBe(true);
    });

    it('correctly classifies Audio tracks', () => {
      const mp3Cap = detectFileCapability('podcast_ep1.mp3', 'audio/mpeg');
      expect(mp3Cap.viewerType).toBe('audio');
      expect(mp3Cap.category).toBe('Audio');
      expect(mp3Cap.canPreview).toBe(true);

      const wavCap = detectFileCapability('sample.wav', 'audio/wav');
      expect(wavCap.viewerType).toBe('audio');
    });

    it('correctly classifies Videos including MP4 and WEBM', () => {
      const mp4Cap = detectFileCapability('demo.mp4', 'video/mp4');
      expect(mp4Cap.viewerType).toBe('video');
      expect(mp4Cap.category).toBe('Videos');
      expect(mp4Cap.canPreview).toBe(true);

      const mkvCap = detectFileCapability('recording.mkv', 'video/x-matroska');
      expect(mkvCap.viewerType).toBe('video');
    });

    it('correctly classifies Archives (ZIP, TAR, 7Z, GZ)', () => {
      const zipCap = detectFileCapability('project_bundle.zip', 'application/zip');
      expect(zipCap.viewerType).toBe('archive');
      expect(zipCap.category).toBe('Archives');
      expect(zipCap.canPreview).toBe(true);

      const tarCap = detectFileCapability('archive.tar.gz', 'application/gzip');
      expect(tarCap.viewerType).toBe('archive');
      expect(tarCap.category).toBe('Archives');
    });

    it('handles files with NO extension or unknown extension gracefully', () => {
      const dockerfileCap = detectFileCapability('Dockerfile', '');
      expect(dockerfileCap.viewerType).toBe('code');
      expect(dockerfileCap.canEdit).toBe(true);

      const customCap = detectFileCapability('dataset_raw.xyz', 'application/octet-stream');
      expect(customCap.viewerType).toBe('unsupported');
      expect(customCap.category).toBe('Other');
      expect(customCap.canPreview).toBe(false);
    });

    it('correctly formats human readable file sizes', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('identifies editability correctly', () => {
      expect(isEditableFile('code.ts')).toBe(true);
      expect(isEditableFile('script.js')).toBe(true);
      expect(isEditableFile('style.css')).toBe(true);
      expect(isEditableFile('readme.md')).toBe(true);
      expect(isEditableFile('data.json')).toBe(true);
      expect(isEditableFile('table.csv')).toBe(true);
      expect(isEditableFile('image.png')).toBe(false);
      expect(isEditableFile('archive.zip')).toBe(false);
      expect(isEditableFile('video.mp4')).toBe(false);
    });
  });

  describe('fileManagerApi.uploadSingleFile', () => {
    it('initializes XHR upload and resolves mapped FileItem on success', async () => {
      const mockXHR: any = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        upload: {},
        status: 201,
        responseText: JSON.stringify({
          success: true,
          data: {
            id: 'file-test-123',
            filename: 'architecture.pdf',
            mimeType: 'application/pdf',
            size: 54321,
            category: 'PDFs',
          },
        }),
      };

      const originalXHR = (globalThis as any).XMLHttpRequest;
      (globalThis as any).XMLHttpRequest = vi.fn(() => mockXHR);

      const testFile = new File(['mock content'], 'architecture.pdf', { type: 'application/pdf' });
      const onProgress = vi.fn();
      const onProcessing = vi.fn();

      const { promise } = fileManagerApi.uploadSingleFile(
        testFile,
        'folder-456',
        'proj-789',
        onProgress,
        onProcessing,
      );

      // Verify open and headers
      expect(mockXHR.open).toHaveBeenCalledWith('POST', expect.stringContaining('/uploads/single'), true);
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('x-folder-id', 'folder-456');
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('x-project-id', 'proj-789');

      // Simulate progress
      mockXHR.upload.onprogress({ lengthComputable: true, loaded: 27160, total: 54321 });
      expect(onProgress).toHaveBeenCalledWith(27160, 54321, 50);

      // Simulate 100% upload progress
      mockXHR.upload.onprogress({ lengthComputable: true, loaded: 54321, total: 54321 });
      expect(onProcessing).toHaveBeenCalled();

      // Simulate response load
      mockXHR.onload();

      const result = await promise;
      expect(result.id).toBe('file-test-123');
      expect(result.filename).toBe('architecture.pdf');
      expect(result.size).toBe(54321);

      (globalThis as any).XMLHttpRequest = originalXHR;
    });

    it('supports aborting an in-flight upload', async () => {
      const mockXHR: any = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        abort: vi.fn(),
        readyState: 1, // OPENED
        upload: {},
      };

      const originalXHR = (globalThis as any).XMLHttpRequest;
      (globalThis as any).XMLHttpRequest = vi.fn(() => mockXHR);

      const testFile = new File(['large binary'], 'big_video.mp4', { type: 'video/mp4' });
      const { promise, abort } = fileManagerApi.uploadSingleFile(testFile);

      abort();
      expect(mockXHR.abort).toHaveBeenCalled();

      // Trigger onabort
      mockXHR.onabort();

      await expect(promise).rejects.toThrow('Upload cancelled.');

      (globalThis as any).XMLHttpRequest = originalXHR;
    });
  });
});
