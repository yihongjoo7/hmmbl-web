import { uploadFile } from '@/lib/api/fileUploadClient';
import type { UploadResult } from '@/lib/api/fileUploadClient';
import { apiClient } from '@/lib/api/apiClient';

export const fileApi = {
  upload: (file: File, onProgress?: (percent: number) => void): Promise<UploadResult> =>
    uploadFile(file, '/files/upload', { onProgress }),

  uploadImage: (file: File, onProgress?: (percent: number) => void): Promise<UploadResult> =>
    uploadFile(file, '/files/image', { onProgress }),

  delete: (fileId: string): Promise<void> =>
    apiClient.post<void>('/files/delete', { fileId }),

  getDownloadUrl: (fileId: string): Promise<{ url: string; expiresIn: number }> =>
    apiClient.post<{ url: string; expiresIn: number }>('/files/download-url', { fileId }),
};
