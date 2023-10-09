import { Customer } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { customerSearchFields } from './customer.constant';

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Customer[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = customerSearchFields;
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
  const result = await prisma.customer.findMany({
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
    include: {
      user: { select: { id: true, email: true, role: true, createdAt: true, updatedAt: true } },
      orders: true,
      reviews: true,
    },
  });
  const total = await prisma.customer.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Customer | null> => {
  const result = await prisma.customer.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, role: true, createdAt: true, updatedAt: true } },
      orders: true,
      reviews: true,
    },
  });
  if (!result) {
    throw new ApiError(404, 'Customer not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Customer>): Promise<Customer> => {
  const isExist = await prisma.customer.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Customer not found');
  }
  const result = await prisma.customer.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Customer> => {
  const isExist = await prisma.customer.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Customer not found');
  }
  const result = await prisma.customer.delete({ where: { id } });
  return result;
};

export const customerService = { getAll, getById, update, remove };
