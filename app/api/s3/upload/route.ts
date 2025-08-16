import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '@/lib/S3Client';
import {
  S3PresignedUrlRequestSchema,
  S3PresignedUrlResponse,
} from '@/lib/api/schema/s3.schema';
import arcject, { detectBot, fixedWindow } from '@/lib/arcject';
import { requireAdmin } from '@/data/admin/require-admin';

const aj = arcject
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    })
  )
  .withRule(
    // Rate limit for generating presigned URLs
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 5,
    })
  );
export async function POST(request: Request) {
  const session = await requireAdmin();
  try {
    // Apply Arcject rules
    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Request Denied' }, { status: 429 });
    }

    const body = await request.json();

    const validatedData = S3PresignedUrlRequestSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid Request Body' },
        { status: 400 }
      );
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

    const response: S3PresignedUrlResponse = {
      presignedUrl,
      key: fileKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
