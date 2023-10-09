import { Admin } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { adminSearchFields } from './admin.constant';

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Admin[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = adminSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['name'] = 'asc'; // default sorting
  }
  let whereCondition = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.admin.findMany({
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
    include: {
      user: { select: { id: true, email: true, role: true, createdAt: true, updatedAt: true } },
    },
  });
  const total = await prisma.admin.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, role: true, createdAt: true, updatedAt: true } },
    },
  });
  if (!result) {
    throw new ApiError(404, 'Admin not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Admin>): Promise<Admin> => {
  const isExist = await prisma.admin.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Admin not found');
  }
  const result = await prisma.admin.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Admin> => {
  const isExist = await prisma.admin.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Admin not found');
  }
  const result = await prisma.admin.delete({ where: { id } });
  return result;
};

export const adminService = { getAll, getById, update, remove };
