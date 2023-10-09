import { z } from 'zod';

const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const forgotPassword = z.object({
  email: z.string().email(),
});

const resetPassword = z.object({
  password: z.string().min(6),
});

export const authZodSchema = { login, forgotPassword, resetPassword };
