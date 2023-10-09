import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

const warranty = ['1 month', '3 months', '6 months', '1 year', '2 years', '3 years', '5 years'];

const create = z.object({
  image: z.string().url(),
  name: z.string().min(3).max(255),
  description: z.string().min(3),
  price: z.number().min(0),
  stock: z.number().min(0),
  status: z.enum([...Object.values(ProductStatus)] as [string]),
  warranty: z.enum([...warranty] as [string]),
  subCategoryId: z.string().uuid(),
  sellerId: z.string().uuid(),
});

const update = z.object({
  image: z.string().url().optional(),
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(3).max(255).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  status: z.enum([...Object.values(ProductStatus)] as [string]).optional(),
  warranty: z.enum([...warranty] as [string]).optional(),
  subCategoryId: z.string().uuid().optional(),
});

export const productZodSchema = { create, update };
