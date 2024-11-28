import { z } from 'zod';
import { formatErrors } from '../pipe/zod-validation.pipe';

const EnvironmentVariablesSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(8).max(256),
});

export function validateEnv(config: Record<string, unknown>) {
  const result = EnvironmentVariablesSchema.safeParse(config);

  if (!result.success) {
    throw new Error(formatErrors(result.error).join('\n'));
  }

  return result.data;
}

type EnvSchema = typeof EnvironmentVariablesSchema;

export type ENV = z.infer<EnvSchema>;
