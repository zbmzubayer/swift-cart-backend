import { Category } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { categoryFilterFields } from './category.constant';
import { categoryService } from './category.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await categoryService.create(data);
  sendResponse<Category>(res, {
    status: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, categoryFilterFields);
  const result = await categoryService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.getById(id);
  sendResponse<Category>(res, {
    status: 200,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await categoryService.update(id, data);
  sendResponse<Category>(res, {
    status: 200,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.remove(id);
  sendResponse<Category>(res, {
    status: 200,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const categoryController = { create, getAll, getById, update, remove };
