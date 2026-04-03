import { z } from 'zod';

export const configSchema = z.object({
  DATABASE_URL: z.string(),
  APP_PORT: z
    .string()
    .default('3000')
    .transform((port) => parseInt(port, 10)),
  API_PREFIX: z.string().default('api'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z
    .string()
    .min(16, 'REDIS_PASSWORD must be at least 16 characters'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
