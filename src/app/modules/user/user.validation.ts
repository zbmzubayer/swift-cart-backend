import { Gender } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
  admin: z.object({
    image: z.string().url(),
    name: z.string().min(3).max(255),
    phone: z.string().min(5).max(11),
    gender: z.enum([...Object.values(Gender)] as [string]),
    dob: z.coerce.date(),
    address: z.string().min(3).max(255),
  }),
});

const createCustomer = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
  customer: z.object({
    name: z.string().min(3).max(255),
    phone: z.string().min(5).max(11),
  }),
});

const createSeller = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
  seller: z.object({
    image: z.string().url(),
    name: z.string().min(3).max(255),
    phone: z.string().min(5).max(11),
    gender: z.enum([...Object.values(Gender)] as [string]),
    dob: z.coerce.date(),
    address: z.string().min(3).max(255),
    companyName: z.string().min(3).max(255),
    companyLogo: z.string().url(),
    companyAddress: z.string().min(3).max(255),
  }),
});

const changeEmail = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

const changePassword = z.object({
  oldPassword: z.string().min(8).max(255),
  newPassword: z.string().min(8).max(255),
});

export const userZodSchema = {
  createAdmin,
  createCustomer,
  createSeller,
  changeEmail,
  changePassword,
};
