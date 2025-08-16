import {
  S3PresignedUrlRequest,
  S3PresignedUrlResponse,
} from '@/lib/api/schema/s3.schema';
import { API_ROUTES } from '@/lib/api/routes';

export const s3Client = {
  async getPresignedUrl(
    data: S3PresignedUrlRequest
  ): Promise<S3PresignedUrlResponse> {
    const response = await fetch(API_ROUTES.s3.upload, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    return await response.json();
  },

  async uploadFileWithProgress(
    presignedUrl: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);

      xhr.upload.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },
};
