import { Role } from '@prisma/client';
import { Router } from 'express';
import authGuard from '../../middlewares/guards/auth.guard';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userZodSchema } from './user.validation';

const router = Router();

router.post(
  '/create-admin',
  authGuard(Role.SuperAdmin),
  validateRequest(userZodSchema.createAdmin),
  userController.createAdmin
);
router.post(
  '/create-customer',
  validateRequest(userZodSchema.createCustomer),
  userController.createCustomer
);
router.post(
  '/create-seller',
  validateRequest(userZodSchema.createSeller),
  userController.createSeller
);
router.get('/', authGuard(Role.SuperAdmin, Role.Admin), userController.getAll);
router.get(
  '/:id',
  authGuard(Role.SuperAdmin, Role.Admin, Role.Seller, Role.Customer),
  userController.getById
);
router.patch(
  '/:id/change-email',
  validateRequest(userZodSchema.changeEmail),
  userController.changeEmail
);
router.patch(
  '/:id/change-password',
  validateRequest(userZodSchema.changePassword),
  userController.changePassword
);

export const userRouter = router;
