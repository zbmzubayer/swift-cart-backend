import { Prisma, SubCategory } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { subCategorySearchFields } from './sub-category.constant';

// CRUD
const create = async (data: SubCategory): Promise<SubCategory> => {
  const result = prisma.subCategory.create({ data });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<SubCategory[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = subCategorySearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['name'] = 'asc'; // default sorting
  }
  let whereCondition: Prisma.SubCategoryWhereInput = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.subCategory.findMany({
    include: { products: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.subCategory.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<SubCategory | null> => {
  const result = await prisma.subCategory.findUnique({
    include: { products: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Sub-category not found');
  }
  return result;
};

const update = async (id: string, data: Partial<SubCategory>): Promise<SubCategory> => {
  const isExist = await prisma.subCategory.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Sub-category not found');
  }
  const result = await prisma.subCategory.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<SubCategory> => {
  const isExist = await prisma.subCategory.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Sub-category not found');
  }
  const result = await prisma.subCategory.delete({ where: { id } });
  return result;
};

export const subCategoryService = { create, getAll, getById, update, remove };
