import { Category, Prisma } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { categorySearchFields } from './category.constant';

// CRUD
const create = async (data: Category): Promise<Category> => {
  const result = prisma.category.create({ data });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Category[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = categorySearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['name'] = 'asc'; // default sorting
  }
  // searching
  let searchConditions: { [key: string]: { contains: string; mode?: 'insensitive' } }[] = [];
  if (searchTerm) {
    searchConditions = searchFields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    }));
  }
  // filtering
  let filterConditions: { [key: string]: unknown }[] = [];
  if (Object.keys(filterFields).length) {
    filterConditions = Object.entries(filterFields).map(([key, value]) => ({
      [key]: value,
    }));
  }
  // where condition
  let whereCondition: Prisma.CategoryWhereInput = {};
  if (searchConditions.length && filterConditions.length) {
    whereCondition = { AND: filterConditions, OR: searchConditions };
  } else if (searchConditions.length && !filterConditions.length) {
    whereCondition = { OR: searchConditions };
  } else if (!searchConditions.length && filterConditions.length) {
    whereCondition = { AND: filterConditions };
  }
  // let whereCondition = {};
  // if (searchTerm || Object.keys(filterFields).length) {
  //   whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  // }
  const result = await prisma.category.findMany({
    include: { subCategories: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.category.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    include: { subCategories: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Category not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Category>): Promise<Category> => {
  const isExist = await prisma.category.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Category not found');
  }
  const result = await prisma.category.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Category> => {
  const isExist = await prisma.category.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Category not found');
  }
  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const categoryService = { create, getAll, getById, update, remove };
