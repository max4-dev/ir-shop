import { z } from 'zod';

export const configSchema = z.object({
  DATABASE_URL: z.string(),
  APP_PORT: z
    .string()
    .default('3000')
    .transform((port) => parseInt(port, 10)),
  API_PREFIX: z.string().default('api'),
});

export type ConfigSchema = z.infer<typeof configSchema>;
