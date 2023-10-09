import { Role } from '@prisma/client';
import { Router } from 'express';
import authGuard from '../../middlewares/guards/auth.guard';
import validateRequest from '../../middlewares/validateRequest';
import { authController } from './auth.controller';
import { authZodSchema } from './auth.validation';

const router = Router();

router.post('/login', validateRequest(authZodSchema.login), authController.login);
router.get(
  '/user-profile',
  authGuard(Role.Admin, Role.Seller, Role.Customer),
  authController.getUserByToken
);
// router.post(
//   '/access-token',
//   validateRequest(authValidation.refreshTokenZodSchema),
//   authController.getAccessToken
// );
// router.patch(
//   '/change-password',
//   auth(UserRoles.SuperAdmin, UserRoles.Admin, UserRoles.Faculty, UserRoles.Student),
//   validateRequest(authValidation.changePasswordZodSchema),
//   authController.changePassword
// );

export const authRouter = router;
