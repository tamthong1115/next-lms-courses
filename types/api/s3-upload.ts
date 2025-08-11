import z from 'zod';

export const FileUploadRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().min(1),
  isImage: z.boolean(),
});
export type FileUploadRequest = z.infer<typeof FileUploadRequestSchema>;

export const FileUploadResponseSchema = z.object({
  presignedUrl: z.string().url(),
  key: z.string(),
});
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
