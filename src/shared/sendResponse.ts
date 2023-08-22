import { Response } from 'express';

type ApiResponse<T> = {
  status: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, obj: ApiResponse<T>): void => {
  const responseData: ApiResponse<T> = {
    status: obj.status,
    success: obj.success,
    message: obj.message || null,
    meta: obj.meta,
    data: obj.data || null,
  };
  res.status(obj.status).json(responseData);
};

export default sendResponse;
