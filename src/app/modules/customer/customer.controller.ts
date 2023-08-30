import { Customer } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { customerFilterFields } from './customer.constant';
import { customerService } from './customer.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await customerService.create(data);
  sendResponse<Customer>(res, {
    status: 201,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, customerFilterFields);
  const result = await customerService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Customers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await customerService.getById(id);
  sendResponse<Customer>(res, {
    status: 200,
    success: true,
    message: 'Customer retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await customerService.update(id, data);
  sendResponse<Customer>(res, {
    status: 200,
    success: true,
    message: 'Customer updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await customerService.remove(id);
  sendResponse<Customer>(res, {
    status: 200,
    success: true,
    message: 'Customer deleted successfully',
    data: result,
  });
});

export const customerController = { create, getAll, getById, update, remove };
