/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { config } from '../../config';
import { GenericErrorMessages } from '../../shared/errorResponse';
import prismaErrorHandler from './prismaErrorHandler';
import zodErrorHandler from './zodErrorHandler';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string | undefined,
    public stack = ''
  ) {
    super(message);
    this.status = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let status = 500;
  let message = 'Something went wrong!';
  let errorMessages: GenericErrorMessages[] = [];

  if (err instanceof ZodError) {
    const zodError = zodErrorHandler(err);
    status = zodError.status;
    message = zodError.message;
    errorMessages = zodError.errorMessages;
  } else if (err instanceof ApiError) {
    status = err?.status;
    message = err?.message;
    errorMessages = err?.message ? [{ path: '', message: err?.message }] : [];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = prismaErrorHandler(err);
    status = prismaError.status;
    message = prismaError.message;
    errorMessages = prismaError.errorMessages;
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  }

  res.status(status).json({
    success: false,
    message,
    errorMessages,
    stack: config.ENV != 'production' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
