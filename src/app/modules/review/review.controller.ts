import { Review } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { reviewFilterFields } from './review.constant';
import { reviewService } from './review.service';

const create = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await reviewService.create(data);
  sendResponse<Review>(res, {
    status: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, reviewFilterFields);
  const result = await reviewService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewService.getById(id);
  sendResponse<Review>(res, {
    status: 200,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await reviewService.update(id, data);
  sendResponse<Review>(res, {
    status: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await reviewService.remove(id);
  sendResponse<Review>(res, {
    status: 200,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const reviewController = { create, getAll, getById, update, remove };
