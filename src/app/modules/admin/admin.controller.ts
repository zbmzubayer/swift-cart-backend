import { Admin } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { adminFilterFields } from './admin.constant';
import { adminService } from './admin.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await adminService.create(data);
  sendResponse<Admin>(res, {
    status: 201,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, adminFilterFields);
  const result = await adminService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Admins retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.getById(id);
  sendResponse<Admin>(res, {
    status: 200,
    success: true,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await adminService.update(id, data);
  sendResponse<Admin>(res, {
    status: 200,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.remove(id);
  sendResponse<Admin>(res, {
    status: 200,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});

export const adminController = { create, getAll, getById, update, remove };
