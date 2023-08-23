export type PaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export type PaginationResult<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export const paginationFields = ['page', 'limit', 'sortBy', 'order'];

export const calculatePagination = (paginationOptions: PaginationOptions) => {
  const page = Number(paginationOptions.page) || 1;
  const take = Number(paginationOptions.limit) || 10;
  const skip = (page - 1) * take;
  const sortBy = paginationOptions.sortBy;
  const order = paginationOptions.order || 'desc';
  return { page, take, skip, sortBy, order };
};
