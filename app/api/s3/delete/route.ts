import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';
import { S3 } from '@/lib/S3Client';
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
export async function DELETE(request: Request) {
  const session = await requireAdmin();
  try {
    // Apply Arcject rules
    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Request Denied' }, { status: 429 });
    }

    const data = await request.json();

    const { key } = data;

    if (!key) {
      return NextResponse.json(
        { error: 'Missing or invalid key' },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);
    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
