import { Admin, Customer, Prisma, Role, Seller, User } from '@prisma/client';
import prisma from '../../../client';
import { bcryptHelper } from '../../helpers/bcryptHelper';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { userSearchFields } from './user.constant';
import { userZodSchema } from './user.validation';

const createAdmin = async (data: User, userData: Admin): Promise<Partial<User>> => {
  userData.dob = new Date(userData.dob);
  data.password = await bcryptHelper.hashPassword(data.password);
  data.role = Role.Admin;
  await userZodSchema.createAdmin.parseAsync({ ...data, admin: userData });
  const result = await prisma.user.create({
    data: { ...data, admin: { create: userData } },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
    },
  });
  return result;
};

const createCustomer = async (data: User, userData: Customer): Promise<Partial<User>> => {
  data.password = await bcryptHelper.hashPassword(data.password);
  data.role = Role.Customer;
  await userZodSchema.createCustomer.parseAsync({ ...data, customer: userData });
  const result = await prisma.user.create({
    data: { ...data, customer: { create: userData } },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      customer: true,
    },
  });
  return result;
};

const createSeller = async (data: User, userData: Seller): Promise<Partial<User>> => {
  userData.dob = new Date(userData.dob);
  data.password = await bcryptHelper.hashPassword(data.password);
  data.role = Role.Seller;
  await userZodSchema.createSeller.parseAsync({ ...data, seller: userData });
  const result = await prisma.user.create({
    data: { ...data, seller: { create: userData } },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      seller: true,
    },
  });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Partial<User>[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = userSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['email'] = 'asc'; // default sorting
  }
  let whereCondition: Prisma.UserWhereInput = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.user.findMany({
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      customer: true,
      seller: true,
    },
  });
  const total = await prisma.user.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Partial<User>> => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      customer: true,
      seller: true,
    },
  });
  if (!result) throw new ApiError(404, 'User does not exist');
  return result;
};

const changeEmail = async (
  id: string,
  data: { email: string; password: string }
): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, 'User does not exist');
  const isPasswordMatch = await bcryptHelper.validatePassword(data.password, user.password);
  if (!isPasswordMatch) throw new ApiError(400, 'Password is incorrect');
  const result = await prisma.user.update({
    where: { id },
    data: { email: data.email },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const changePassword = async (
  id: string,
  data: { oldPassword: string; newPassword: string }
): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, 'User does not exist');
  const isPasswordMatch = await bcryptHelper.validatePassword(data.oldPassword, user.password);
  if (!isPasswordMatch) throw new ApiError(400, 'Password is incorrect');
  const newPassword = await bcryptHelper.hashPassword(data.newPassword);
  const result = await prisma.user.update({
    where: { id },
    data: { password: newPassword },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const userService = {
  createAdmin,
  createCustomer,
  createSeller,
  getAll,
  getById,
  changeEmail,
  changePassword,
};
