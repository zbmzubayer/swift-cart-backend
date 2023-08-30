import { z } from 'zod';

const create = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().min(1),
  productId: z.string().uuid(),
  customerId: z.string().uuid(),
});

const update = z.object({
  rating: z.number().min(0).max(5).optional(),
  comment: z.string().min(1).optional(),
  productId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
});

export const reviewZodSchema = { create, update };
