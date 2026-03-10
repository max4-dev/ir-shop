import { configSchema } from '../config/app-config';

export const validateConfig = (
  config: Record<string, any>,
): Record<string, any> => {
  const parsed = configSchema.safeParse(config);
  if (parsed.success === false) {
    throw new Error(`Configuration validation error: ${parsed.error}`);
  }
  return parsed.data;
};
