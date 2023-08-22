import { SubCategory } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { subCategoryFilterFields } from './sub-category.constant';
import { subCategoryService } from './sub-category.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await subCategoryService.create(data);
  sendResponse<SubCategory>(res, {
    status: 201,
    success: true,
    message: 'Sub-category created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, subCategoryFilterFields);
  const result = await subCategoryService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Sub-categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoryService.getById(id);
  sendResponse<SubCategory>(res, {
    status: 200,
    success: true,
    message: 'Sub-category retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await subCategoryService.update(id, data);
  sendResponse<SubCategory>(res, {
    status: 200,
    success: true,
    message: 'Sub-category updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoryService.remove(id);
  sendResponse<SubCategory>(res, {
    status: 200,
    success: true,
    message: 'Sub-category deleted successfully',
    data: result,
  });
});

export const subCategoryController = { create, getAll, getById, update, remove };
