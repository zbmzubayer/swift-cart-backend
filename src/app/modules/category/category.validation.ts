import { z } from 'zod';

const create = z.object({
  name: z.string().min(2).max(255),
});

const update = z.object({
  name: z.string().min(2).max(255).optional(),
});

export const categoryZodSchema = { create, update };
