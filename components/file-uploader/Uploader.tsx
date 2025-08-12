'use client';

import { FileRejection, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from '@/components/file-uploader/RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../../lib/api/client/s3.client';

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

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

// TODO: Add schema for the file and key in the UploaderState interface
// TODO: Move the file upload logic to a separate service or utility function for better separation of concerns
// TODO: Create a custom hook for managing the file upload state and logic
export function Uploader({ onChange, value }: iAppProps) {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: 'image',
    key: value,
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // Get presigned URL from the server
      const { presignedUrl, key } = await s3Client.getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        isImage: file.type.startsWith('image/'),
      });

      await s3Client.uploadFileWithProgress(
        presignedUrl,
        file,
        (percentageCompleted: number) => {
          setFileState((prev) => ({
            ...prev,
            progress: percentageCompleted,
          }));
        }
      );

      setFileState((prev) => ({
        ...prev,
        progress: 100,
        uploading: false,
        key: key,
      }));

      if (onChange) {
        onChange(key);
      }

      toast.success('File uploaded successfully');

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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Revoke the previous object URL if it exists and is not a valid HTTP URL
        if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

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
    },
    [fileState.objectUrl]
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error('Failed to delete file');

        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));

        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      if (onChange) {
        onChange(''); // Clear the value in the parent component
      }

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        id: null,
        isDeleting: false,
        fileType: 'image',
      }));

      toast.success('File deleted successfully');
    } catch (e) {
      console.error('Error deleting file:', e);
      toast.error('Failed to delete file, please try again later');
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

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
        toast.error(
          `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
        );
      }

      if (tooManyFiles) {
        toast.error(`You can only upload ${MAX_FILES} file at a time.`);
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      // Revoke the previous object URL if it exists and is not a valid HTTP URL
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
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
        {renderContent()}
      </CardContent>
    </Card>
  );
}
