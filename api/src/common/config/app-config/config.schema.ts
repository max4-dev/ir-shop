import { z } from 'zod';
import { TIME } from '../../constants';

export const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const configSchema = z
  .object({
    NODE_ENV: z
      .enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.TEST])
      .default(NodeEnv.DEVELOPMENT),
    DATABASE_URL: z.string(),
    APP_PORT: z.coerce.number().int().positive().default(4444),
    API_PREFIX: z.string().default('api'),
    CLIENT_URL: z.string().url(),
    ADMIN_URL: z.string().url().default('http://localhost:5173'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z
      .string()
      .min(16, 'REDIS_PASSWORD must be at least 16 characters'),
    REDIS_TLS: z
      .enum(['true', 'false', '1', '0'])
      .default('false')
      .transform((value) => value === 'true' || value === '1'),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    YOOKASSA_SHOP_ID: z.string().min(1),
    YOOKASSA_SECRET_KEY: z.string().min(1),
    YOOKASSA_RETURN_URL: z.string().url(),
    SMTP_HOST: z.string().min(1).optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_SECURE: z
      .enum(['true', 'false', '1', '0'])
      .default('true')
      .transform((value) => value === 'true' || value === '1'),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_PASSWORD: z.string().min(1).optional(),
    MAIL_FROM: z.string().email().optional(),
    MAIL_FROM_NAME: z.string().min(1).default('IR Shop'),
    EMAIL_TOKEN_TTL_VERIFY: z.coerce
      .number()
      .int()
      .positive()
      .default(TIME.IN_SEC.ONE_DAY),
    EMAIL_TOKEN_TTL_RESET: z.coerce
      .number()
      .int()
      .positive()
      .default(TIME.IN_SEC.ONE_HOUR),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== NodeEnv.PRODUCTION) {
      return;
    }

    const requiredSmtpFields = [
      ['SMTP_HOST', env.SMTP_HOST],
      ['SMTP_USER', env.SMTP_USER],
      ['SMTP_PASSWORD', env.SMTP_PASSWORD],
      ['MAIL_FROM', env.MAIL_FROM],
    ] as const;

    for (const [path, value] of requiredSmtpFields) {
      if (!value) {
        ctx.addIssue({
          code: 'custom',
          path: [path],
          message: `${path} обязателен в production`,
        });
      }
    }
  });

export type ConfigSchema = z.infer<typeof configSchema>;
