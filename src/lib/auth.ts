import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Resend } from 'resend';
import { db } from '@/db';
import * as schema from '@/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'goalmax <noreply@goalmax.ai>',
        to: user.email,
        subject: 'Verify your goalmax email',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0a0a0b;">
            <h1 style="color: #22c55e; font-size: 32px; margin-bottom: 24px;">goalmax</h1>
            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Verify your email</h2>
            <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Click the button below to verify your email address.
            </p>
            <a href="${url}" style="display: inline-block; background-color: #22c55e; color: #0a0a0b; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
              Verify Email
            </a>
            <p style="color: #71717a; font-size: 14px; margin-top: 24px;">
              If you didn't create a goalmax account, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'goalmax <noreply@goalmax.ai>',
        to: user.email,
        subject: 'Reset your goalmax password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #22c55e; font-size: 32px; margin-bottom: 24px;">goalmax</h1>
            <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Reset your password</h2>
            <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              You requested to reset your password. Click the button below to set a new password.
            </p>
            <a href="${url}" style="display: inline-block; background-color: #22c55e; color: #0a0a0b; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
              Reset Password
            </a>
            <p style="color: #71717a; font-size: 14px; margin-top: 24px;">
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #71717a; font-size: 14px;">
              This link expires in 1 hour.
            </p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    // Add providers as needed
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    'https://goalmax.ai',
    'http://localhost:3000',
    'http://192.168.*', // Local dev network
    'exp://*', // Expo development
    'goalmax://*', // App deep links
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Mobile apps don't use cookies the same way
    },
  },
});

export type Session = typeof auth.$Infer.Session;
