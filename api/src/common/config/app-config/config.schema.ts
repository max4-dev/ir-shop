import { z } from 'zod';

export const configSchema = z.object({
  DATABASE_URL: z.string(),
  APP_PORT: z
    .string()
    .default('3000')
    .transform((port) => parseInt(port, 10)),
  API_PREFIX: z.string().default('api'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
