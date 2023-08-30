import { z } from 'zod';
import { UserGender } from '../../../enums/userGender';

const create = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(5).max(11),
  gender: z.enum([...UserGender] as [string]),
  dob: z.coerce.date(),
  address: z.string().min(3).max(255),
  password: z.string().min(8).max(255),
});

const update = z.object({
  image: z.string().url().optional(),
  name: z.string().min(3).max(255).optional(),
  phone: z.string().min(5).max(11).optional(),
  gender: z.enum([...UserGender] as [string]).optional(),
  dob: z.coerce.date().optional(),
  address: z.string().min(3).max(255).optional(),
});

const changeEmail = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

const changePassword = z.object({
  oldPassword: z.string().min(8).max(255),
  newPassword: z.string().min(8).max(255),
});

export const adminZodSchema = { create, update, changeEmail, changePassword };
