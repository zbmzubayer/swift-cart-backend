import { Seller } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { sellerFilterFields } from './seller.constant';
import { sellerService } from './seller.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await sellerService.create(data);
  sendResponse<Seller>(res, {
    status: 201,
    success: true,
    message: 'Seller created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, sellerFilterFields);
  const result = await sellerService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Sellers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await sellerService.getById(id);
  sendResponse<Seller>(res, {
    status: 200,
    success: true,
    message: 'Seller retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await sellerService.update(id, data);
  sendResponse<Seller>(res, {
    status: 200,
    success: true,
    message: 'Seller updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await sellerService.remove(id);
  sendResponse<Seller>(res, {
    status: 200,
    success: true,
    message: 'Seller deleted successfully',
    data: result,
  });
});

export const sellerController = { create, getAll, getById, update, remove };
