import { z } from 'zod';

const orderStatus = ['Pending', 'Processing', 'Delivered', 'Cancelled', 'Refunded', 'Failed'];

const create = z.object({
  phone: z.string().min(10).max(11),
  address: z.string().min(3).max(255),
  customerId: z.string().uuid(),
  orderItems: z.array(
    z.object({
      quantity: z.number().min(1),
      productId: z.string().uuid(),
    })
  ),
});

const update = z.object({
  status: z.enum([...orderStatus] as [string]).optional(),
  phone: z.string().min(10).max(11).optional(),
  address: z.string().min(3).max(255).optional(),
  customerId: z.string().uuid().optional(),
  orderItems: z
    .array(
      z.object({
        quantity: z.number().min(1).optional(),
        productId: z.string().uuid().optional(),
      })
    )
    .optional(),
});

export const orderZodSchema = { create, update };
