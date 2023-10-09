import { Prisma, Product } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { productSearchFields } from './product.constant';

// CRUD
const create = async (data: Product): Promise<Product> => {
  data.url = data.name.toLowerCase().replace(/ /g, '-') + `-${data.sellerId}`;
  const result = await prisma.product.create({ data });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Product[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = productSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['soldCount'] = 'desc'; // default sorting
  }
  let whereCondition: Prisma.ProductWhereInput = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.product.findMany({
    include: { subCategory: { include: { category: true } }, seller: true, reviews: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.product.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    include: { subCategory: true, seller: true, reviews: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Product not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Product>): Promise<Product> => {
  const isExist = await prisma.product.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Product not found');
  }
  const result = await prisma.product.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Product> => {
  const isExist = await prisma.product.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Product not found');
  }
  const result = await prisma.product.delete({ where: { id } });
  return result;
};

export const productService = { create, getAll, getById, update, remove };
