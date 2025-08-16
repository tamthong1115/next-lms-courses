import z from 'zod';

export const S3PresignedUrlRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().min(1),
  isImage: z.boolean(),
});
export type S3PresignedUrlRequest = z.infer<typeof S3PresignedUrlRequestSchema>;

export const S3PresignedUrlResponseSchema = z.object({
  presignedUrl: z.string().url(),
  key: z.string(),
});
export type S3PresignedUrlResponse = z.infer<
  typeof S3PresignedUrlResponseSchema
>;
