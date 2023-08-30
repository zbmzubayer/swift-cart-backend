import { Product } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { productFilterFields } from './product.constant';
import { productService } from './product.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await productService.create(data);
  sendResponse<Product>(res, {
    status: 201,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, productFilterFields);
  const result = await productService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productService.getById(id);
  sendResponse<Product>(res, {
    status: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await productService.update(id, data);
  sendResponse<Product>(res, {
    status: 200,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productService.remove(id);
  sendResponse<Product>(res, {
    status: 200,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const productController = { create, getAll, getById, update, remove };
