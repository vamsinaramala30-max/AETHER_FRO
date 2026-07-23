import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface UploadResponseDTO {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export const uploadApi = {
  uploadFile: (file: File, onProgress?: (progress: number) => void, config?: RequestConfig): Promise<UploadResponseDTO> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<UploadResponseDTO>(ENDPOINTS.UPLOADS.SINGLE, formData, config);
  },
};