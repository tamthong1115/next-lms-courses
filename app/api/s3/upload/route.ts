import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '@/lib/S3Client';
import { FileUploadRequestSchema, FileUploadResponse } from '@/types/api/s3-upload';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = FileUploadRequestSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }

    const { fileName, contentType, size, isImage } = validatedData.data;

    const fileKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // URL expires in 6 minutes
    });

    const response: FileUploadResponse = {
      presignedUrl,
      key: fileKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
  }
}
