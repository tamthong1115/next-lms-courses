import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './db';
import { env } from './env';
import { admin, emailOTP } from 'better-auth/plugins';
import { resend } from './resend';
import { EmailTemplate } from '@/components/sidebar/email-template';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: 'LMS-Courses <onboarding@resend.dev>',
          to: [email],
          subject: 'LMS-Courses - Verify your email',
          react: EmailTemplate({ otp: otp }),
        });
      },
    }),
    admin(),
  ],
});
