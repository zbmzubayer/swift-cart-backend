import { Prisma, Seller } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { sellerSearchFields } from './seller.constant';

// CRUD
const create = async (data: Seller): Promise<Seller> => {
  data.dob = new Date(data.dob);
  const result = prisma.seller.create({ data });
  return result;
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Seller[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = sellerSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['name'] = 'asc'; // default sorting
  }
  let whereCondition: Prisma.SellerWhereInput = { deletedAt: null };
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.seller.findMany({
    include: { products: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.seller.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Seller | null> => {
  const result = await prisma.seller.findUnique({
    include: { products: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Seller not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Seller>): Promise<Seller> => {
  const isExist = await prisma.seller.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Seller not found');
  }
  const result = await prisma.seller.update({ where: { id }, data });
  return result;
};

const remove = async (id: string): Promise<Seller> => {
  const isExist = await prisma.seller.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Seller not found');
  }
  const result = await prisma.seller.update({ where: { id }, data: { deletedAt: new Date() } });
  return result;
};

export const sellerService = { create, getAll, getById, update, remove };
