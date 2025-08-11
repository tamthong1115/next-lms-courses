'use client';

import { FileRejection, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState } from '@/components/file-uploader/RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 1;

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: 'image' | 'video';
}
export function Uploader() {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: 'image',
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // Get presigned URL from the server
      const presignedUrlResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: file.type.startsWith('image/'),
        }),
      });

      if (!presignedUrlResponse.ok) {
        toast.error('Failed to get presigned URL');
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await presignedUrlResponse.json();

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file), // Create a temporary URL for the file
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: file.type.startsWith('image/') ? 'image' : 'video',
      });

      uploadFile(file);
    }
  }, []);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'too-many-files'
      );

      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-too-large'
      );

      const fileTypeError = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-invalid-type'
      );

      if (fileTypeError) {
        toast.error('Unsupported file type. Please upload an image or video.');
      }

      if (fileTooLarge) {
        toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
      }

      if (tooManyFiles) {
        toast.error(`You can only upload ${MAX_FILES} file at a time.`);
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64',
        isDragActive
          ? 'border-primary bg-primary/10 border-solid'
          : 'border-border hover:border-primary'
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full">
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
        <RenderErrorState />
      </CardContent>
    </Card>
  );
}
