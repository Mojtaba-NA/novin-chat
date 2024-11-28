import { z } from 'zod';

export const signin_schema = z.strictObject({
  username: z.string().min(4).max(60).toLowerCase(),
  password: z.string().min(6).max(50),
});

export type SigninDto = z.infer<typeof signin_schema>;
