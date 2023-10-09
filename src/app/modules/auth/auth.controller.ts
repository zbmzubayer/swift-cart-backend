import { User } from '@prisma/client';
import { config } from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IToken } from './auth.interface';
import { authService } from './auth.service';

const login = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.login(payload);
  // set refresh token in cookie
  const cookieOptions = {
    secure: config.ENV === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  sendResponse<IToken>(res, {
    status: 200,
    success: true,
    message: 'Logged in successfully',
    data: { accessToken: result.accessToken },
  });
});

const getUserByToken = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const role = req.user?.role;
  const result = await authService.getUserByToken(userId!, role!);
  sendResponse<Partial<User>>(res, {
    status: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

export const authController = { login, getUserByToken };
