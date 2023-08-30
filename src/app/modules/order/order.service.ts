import { Order, OrderItem, Prisma } from '@prisma/client';
import prisma from '../../../client';
import {
  PaginationOptions,
  PaginationResult,
  calculatePagination,
} from '../../helpers/paginationHelper';
import { getWhereCondition } from '../../helpers/searchFilter';
import { ApiError } from '../../middlewares/globalErrorHandler';
import { orderSearchFields } from './order.constant';

// CRUD
const create = async (data: Order, orderItems: OrderItem[]): Promise<Order> => {
  data.code = `ORD-${Math.floor(Math.random() * 1000000) + 1}${Date.now()}`;
  return await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({ data });
    let newTotal = 0;
    for (const item of orderItems) {
      const itemProduct = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
      if (!itemProduct) throw new ApiError(404, 'Product not found');
      if (itemProduct.stock < 0) throw new ApiError(400, 'Product out of stock');
      if (itemProduct) {
        item.orderPrice = itemProduct.price;
      }
      newTotal += item.orderPrice * item.quantity; // calculate total
      item.orderId = createdOrder.id; // set order id
      item.itemTotal = item.orderPrice * item.quantity; // calculate item total
    }
    await tx.orderItem.createMany({ data: orderItems });
    const updatedOrder = await tx.order.update({
      where: { id: createdOrder.id },
      data: { total: newTotal },
      include: { customer: true, orderItems: true },
    });
    return updatedOrder;
  });
};

const getAll = async (
  search: { searchTerm?: string },
  paginationOptions: PaginationOptions
): Promise<PaginationResult<Order[]>> => {
  const { page, take, skip, sortBy, order } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterFields } = search;
  const searchFields = orderSearchFields;
  // sorting
  const sortCondition: { [key: string]: 'asc' | 'desc' } = {};
  if (sortBy && order) {
    sortCondition[sortBy] = order; // sorting by specific field
  } else {
    sortCondition['createdAt'] = 'desc'; // default sorting
  }
  let whereCondition: Prisma.OrderWhereInput = {};
  if (searchTerm || Object.keys(filterFields).length) {
    whereCondition = getWhereCondition(searchTerm, searchFields, filterFields);
  }
  const result = await prisma.order.findMany({
    include: { customer: true, orderItems: true },
    skip,
    take,
    orderBy: [sortCondition],
    where: whereCondition,
  });
  const total = await prisma.order.count({ where: whereCondition });
  return { meta: { page, limit: take, total }, data: result };
};

const getById = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    include: { customer: true, orderItems: true },
    where: { id },
  });
  if (!result) {
    throw new ApiError(404, 'Order not found');
  }
  return result;
};

const update = async (id: string, data: Partial<Order>): Promise<Order> => {
  const isExist = await prisma.order.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Order not found');
  }
  const result = await prisma.order.update({ where: { id }, data: data });
  return result;
};

const cancelOrder = async (id: string): Promise<Order> => {
  const isExist = await prisma.order.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Order not found');
  }
  return await prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    const result = await tx.order.update({
      where: { id },
      data: { status: 'Cancelled' },
    });
    return result;
  });
};

const refundOrder = async (id: string): Promise<Order> => {
  const isExist = await prisma.order.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Order not found');
  }
  return await prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    const result = await tx.order.update({
      where: { id },
      data: { status: 'Refunded' },
    });
    return result;
  });
};

const deliverOrder = async (id: string): Promise<Order | null> => {
  const isExist = await prisma.order.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, 'Order not found');
  }
  return await prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity } },
      });
    }
    const result = await tx.order.updateMany({
      where: { AND: [{ id }, { status: 'Processing' }] },
      data: { status: 'Delivered', deliveredAt: new Date() },
    });
    if (result.count === 0) throw new ApiError(400, 'Order is not in processing state');
    return tx.order.findUnique({ where: { id } });
  });
};

export const orderService = {
  create,
  getAll,
  getById,
  update,
  cancelOrder,
  refundOrder,
  deliverOrder,
};
