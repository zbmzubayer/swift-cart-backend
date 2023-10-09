import { User } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { userFilterFields } from './user.constant';
import { userService } from './user.service';

const createAdmin = catchAsync(async (req, res) => {
  const { admin, ...data } = req.body;
  const result = await userService.createAdmin(data, admin);
  sendResponse<Partial<User>>(res, {
    status: 201,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const { customer, ...data } = req.body;
  const result = await userService.createCustomer(data, customer);
  sendResponse<Partial<User>>(res, {
    status: 201,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

const createSeller = catchAsync(async (req, res) => {
  const { seller, ...data } = req.body;
  const result = await userService.createSeller(data, seller);
  sendResponse<Partial<User>>(res, {
    status: 201,
    success: true,
    message: 'Seller created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, userFilterFields);
  const result = await userService.getAll(filerFields, paginationOptions);
  sendResponse<Partial<User>[]>(res, {
    status: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.getById(id);
  sendResponse<Partial<User>>(res, {
    status: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const changeEmail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await userService.changeEmail(id, data);
  sendResponse<Partial<User>>(res, {
    status: 200,
    success: true,
    message: 'Email changed successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await userService.changePassword(id, data);
  sendResponse<Partial<User>>(res, {
    status: 200,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

export const userController = {
  createAdmin,
  createCustomer,
  createSeller,
  getAll,
  getById,
  changeEmail,
  changePassword,
};
