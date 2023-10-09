import { Prisma, Review } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { reviewSearchFields } from './review.constant';

// CRUD
const create = async (data: Review): Promise<Review> => {
  const result = await prisma.review.create({ data });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Review[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = reviewSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['rating'] = 'desc'; // default sorting
  }
  let whereCondition: Prisma.ReviewWhereInput = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.review.findMany({
    include: { customer: true, product: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.review.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Review | null> => {
  const result = await prisma.review.findUnique({
    include: { customer: true, product: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Review not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Review>): Promise<Review> => {
  const isExist = await prisma.review.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Review not found');
  }
  const result = await prisma.review.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Review> => {
  const isExist = await prisma.review.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Review not found');
  }
  const result = await prisma.review.delete({ where: { id } });
  return result;
};

export const reviewService = { create, getAll, getById, update, remove };
