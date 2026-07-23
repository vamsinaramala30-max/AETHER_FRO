import { uploadApi, UploadResponseDTO } from '../api';

export class UploadService {
  public async uploadSingle(file: File, onProgress?: (percent: number) => void): Promise<UploadResponseDTO> {
    return uploadApi.uploadFile(file, onProgress);
  }
}

export const uploadService = new UploadService();