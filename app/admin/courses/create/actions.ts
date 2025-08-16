'use server';

import { courseSchema, CourseSchemaType } from '@/lib/zodSchema';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { requireAdmin } from '@/data/admin/require-admin';
import arcject, { detectBot, fixedWindow } from '@/lib/arcject';
import { request } from '@arcjet/next';

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

export async function CreateCourseAction(
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    // Access request data that Arcjet needs when you call `protect()` similarly
    // to `await headers()` and `await cookies()` in `next/headers`
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: 'error',
          message: 'Rate limit exceeded. Please try again later.',
        };
      } else {
        return {
          status: 'error',
          message:
            'Request denied due to bot detection. If you believe this is an error, please contact support.',
        };
      }
    }

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid course data',
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user?.id || '',
      },
    });

    return {
      status: 'success',
      message: 'Course created successfully',
    };
  } catch (err) {
    console.error('Error creating course:', err);
    return {
      status: 'error',
      message: 'Failed to create course',
    };
  }
}
