import { z } from 'zod';

const rawEnvSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('https://api.reziphay.com/api/v1'),
  EXPO_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  EXPO_PUBLIC_ENABLE_MOCKS: z.enum(['true', 'false']).default('false'),
});

const parsedEnv = rawEnvSchema.safeParse({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_ENABLE_MOCKS: process.env.EXPO_PUBLIC_ENABLE_MOCKS,
});

if (!parsedEnv.success) {
  throw new Error(
    `Invalid app environment configuration: ${parsedEnv.error.message}`,
  );
}

export const env = {
  apiBaseUrl: parsedEnv.data.EXPO_PUBLIC_API_BASE_URL,
  appEnv: parsedEnv.data.EXPO_PUBLIC_APP_ENV,
  enableMocks: parsedEnv.data.EXPO_PUBLIC_ENABLE_MOCKS === 'true',
} as const;
