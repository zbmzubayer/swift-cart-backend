import { Role, User } from '@prisma/client';
import prisma from '../../../client';
import { bcryptHelper } from '../../helpers/bcryptHelper';
import { jwtHelper } from '../../helpers/jwtHelper';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { IAuth } from './auth.interface';

const login = async (payload: IAuth) => {
  const { email, password } = payload;
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new ApiError(404, 'Email does not exist');
  }
  const isValidPassword = await bcryptHelper.validatePassword(password, isUserExist.password);
  if (!isValidPassword) {
    throw new ApiError(400, 'Invalid credentials');
  }
  let userData = null;
  if (isUserExist.role === Role.Customer) {
    userData = await prisma.customer.findUnique({ where: { userId: isUserExist.id } });
  } else if (isUserExist.role === Role.Seller) {
    userData = await prisma.seller.findUnique({ where: { userId: isUserExist.id } });
  } else if (isUserExist.role === Role.Admin) {
    userData = await prisma.admin.findUnique({ where: { userId: isUserExist.id } });
  } else if (isUserExist.role === Role.SuperAdmin) {
    userData = await prisma.admin.findUnique({ where: { userId: isUserExist.id } });
  }
  const accessToken = jwtHelper.createAccessToken({
    id: isUserExist.id,
    userId: userData?.id,
    role: isUserExist.role,
  });
  const refreshToken = jwtHelper.createRefreshToken({
    id: isUserExist.id,
    userId: userData?.id,
    role: isUserExist.role,
  });
  return { accessToken, refreshToken };
};

const getUserByToken = async (id: string, role: string): Promise<Partial<User>> => {
  let user: Partial<User> | null = null;
  if (role === Role.Customer) {
    user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        customer: true,
      },
    });
  } else if (role === Role.Seller) {
    user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        seller: true,
      },
    });
  } else if (role === Role.Admin) {
    user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        admin: true,
      },
    });
  }
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const authService = { login, getUserByToken };
