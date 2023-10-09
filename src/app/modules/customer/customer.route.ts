import { Role } from '@prisma/client';
import { Router } from 'express';
import authGuard from '../../middlewares/guards/auth.guard';
import userIdGuard from '../../middlewares/guards/userId.guard';
import validateRequest from '../../middlewares/validateRequest';
import { customerController } from './customer.controller';
import { customerZodSchema } from './customer.validation';

const router = Router();

router.get('/', customerController.getAll);
router.get(
  '/:id',
  authGuard(Role.Admin, Role.Customer),
  userIdGuard(Role.Customer),
  customerController.getById
);
router.patch('/:id', validateRequest(customerZodSchema.update), customerController.update);
router.delete('/:id', customerController.remove);

export const customerRouter = router;
