import { z } from 'zod';

const create = z.object({
  name: z.string().min(2).max(255),
  categoryId: z.string().uuid(),
});

const update = z.object({
  name: z.string().min(2).max(255).optional(),
  categoryId: z.string().uuid().optional(),
});

export const subCategoryZodSchema = { create, update };
