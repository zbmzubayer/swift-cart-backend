import { Order } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../helpers/paginationHelper';
import { orderFilterFields } from './order.constant';
import { orderService } from './order.service';

const create = catchAsync(async (req, res) => {
  const { orderItems, ...order } = req.body;
  const result = await orderService.create(order, orderItems);
  sendResponse<Order>(res, {
    status: 201,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filerFields = pick(req.query, orderFilterFields);
  const result = await orderService.getAll(filerFields, paginationOptions);
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderService.getById(id);
  sendResponse<Order>(res, {
    status: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await orderService.update(id, data);
  sendResponse<Order>(res, {
    status: 200,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderService.cancelOrder(id);
  sendResponse<Order>(res, {
    status: 200,
    success: true,
    message: 'Order is cancelled successfully',
    data: result,
  });
});

const refundOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderService.refundOrder(id);
  sendResponse<Order>(res, {
    status: 200,
    success: true,
    message: 'Order is refunded successfully',
    data: result,
  });
});

const deliverOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderService.deliverOrder(id);
  sendResponse<Order>(res, {
    status: 200,
    success: true,
    message: 'Order is delivered successfully',
    data: result,
  });
});

export const orderController = {
  create,
  getAll,
  getById,
  update,
  cancelOrder,
  refundOrder,
  deliverOrder,
};
