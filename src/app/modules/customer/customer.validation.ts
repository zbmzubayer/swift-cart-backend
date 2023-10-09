import { Gender } from '@prisma/client';
import { z } from 'zod';

const update = z.object({
  image: z.string().url().optional(),
  name: z.string().min(3).max(255).optional(),
  phone: z.string().min(5).max(11).optional(),
  gender: z.enum([...Object.values(Gender)] as [string]).optional(),
  dob: z.coerce.date().optional(),
  address: z.string().min(3).max(255).optional(),
});

export const customerZodSchema = { update };
